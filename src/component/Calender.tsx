import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { generateCalendar, CalendarDate } from "./GenerateCalendar";
import { FaCalendarDays } from "react-icons/fa6";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Button from "./Button";

const weekdays: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarProps {
  onChange?: (selectedData: [string[], string[]]) => void;
}

const Calendar = ({ onChange }: CalendarProps) => {
  const [isShow, setIsShow] = useState<boolean>(false);

  const today: Date = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const weeks: (CalendarDate | null)[][] = generateCalendar(year, month);

  const handleDateClick = (date: CalendarDate | null): void => {
    if (!date || date.disabled) return;

    const selectedDate = new Date(year, month, date.day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null); // Reset end date when choosing new start date
    } else if (selectedDate > startDate) {
      setEndDate(selectedDate);
    }
  };

  const changeMonth = (direction: "prev" | "next"): void => {
    setMonth((prev) => {
      const newMonth = direction === "prev" ? prev - 1 : prev + 1;
      if (newMonth < 0) {
        setYear((prevYear) => prevYear - 1);
        return 11;
      }
      if (newMonth > 11) {
        setYear((prevYear) => prevYear + 1);
        return 0;
      }
      return newMonth;
    });
  };

  const isStart = (date: CalendarDate | null): boolean =>
    !!(
      startDate &&
      date &&
      startDate.getDate() === date.day &&
      startDate.getMonth() === month &&
      startDate.getFullYear() === year
    );

  const isEnd = (date: CalendarDate | null): boolean =>
    !!(
      endDate &&
      date &&
      endDate.getDate() === date.day &&
      endDate.getMonth() === month &&
      endDate.getFullYear() === year
    );

  const isInRange = (date: CalendarDate | null): boolean => {
    if (!startDate || !endDate || !date) return false;
    const currentDate = new Date(year, month, date.day);
    return currentDate >= startDate && currentDate <= endDate;
  };

  const isDateDisabled = (date: CalendarDate | null): boolean => {
    if (!date) return true;
    const currentDate = new Date(year, month, date.day);

    // Disable past dates
    if (currentDate.getTime() < today.setHours(0, 0, 0, 0)) return true;

    if (startDate && currentDate < startDate) return true;

    return date.disabled;
  };

  const clearDates = () => {
    setEndDate(null);
    setStartDate(null);
  };

  const handleChange = (): void => {
    if (!startDate || !endDate) return;

    // Format start and end dates
    const selectedRange: string[] = [
      startDate.toISOString().split("T")[0], // Start Date (YYYY-MM-DD)
      endDate.toISOString().split("T")[0], // End Date (YYYY-MM-DD)
    ];

    const weekends: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekends.push(currentDate.toISOString().split("T")[0]);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    onChange?.([selectedRange, weekends]); // Invoke callback with formatted array
  };

  useEffect(() => {
    handleChange();
  }, [startDate, endDate]);

  return (
    <div className="text-center font-mulish">
      <button
        className="w-ful flex items-center justify-between border  w-[400px] rounded-lg border-blue-300 px-4 py-2"
        onClick={() => setIsShow((prev) => !prev)}
      >
        <div className="flex items-center gap-2 ">
          <FaCalendarDays className="text-gray-400" />

          <div className="text-sm tracking-wide text-gray-600">
            {startDate ? startDate.toDateString() : "dd/mm/yy"} -{" "}
            {endDate ? endDate.toDateString() : "dd/mm/yy"}
          </div>
        </div>

        {isShow ? (
          <MdKeyboardArrowUp className="text-gray-600 text-xl" />
        ) : (
          <MdKeyboardArrowDown className="text-gray-600 text-xl" />
        )}
      </button>

      {isShow && (
        <div className="relative top-4 p-4 shadow-lg border border-gray-200  rounded-lg ">
          {/* Month & Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold text-base">
              <div className="w-22">
                {new Date(year, month, 1).toLocaleString("default", {
                  month: "long",
                })}
              </div>

              {/* Year Selector */}
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="outline-none text-base border border-gray-200 p-1 rounded-lg"
              >
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i} value={year - 5 + i}>
                    {year - 5 + i}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => changeMonth("prev")}
                className="p-2 text-xl"
              >
                <FiChevronLeft />
              </button>

              <button
                onClick={() => changeMonth("next")}
                className="p-2 text-xl"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>

          {/* Calendar Table */}
          <table border={1} className="w-full text-center">
            <thead>
              <tr className="">
                {weekdays.map((day, index) => (
                  <th key={index} className="w-8">
                    <div className="mb-6">{day}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, rowIndex) => (
                <tr key={rowIndex} className="">
                  {week.map((date, colIndex) => {
                    const disabled = isDateDisabled(date);
                    const start = isStart(date);
                    const end = isEnd(date);
                    const inRange = isInRange(date);

                    return (
                      <td
                        key={colIndex}
                        className={``}
                        onClick={() => !disabled && handleDateClick(date)}
                      >
                        <div
                          className={`flex items-center justify-center text-center px-1 py-[5px] m-2
                            ${
                              disabled
                                ? "text-gray-400 cursor-not-allowed "
                                : "cursor-pointer"
                            }
              ${start ? "bg-blue-400 text-white rounded-full" : ""}
              ${end ? "bg-blue-400 text-white rounded-full" : ""}
              ${
                inRange && !disabled
                  ? "text-white bg-blue-200 rounded-full"
                  : ""
              }`}
                        >
                          {date ? date.day : ""}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons- clear and save */}
          <div className="flex items-center justify-center gap-6 px-4 pt-4 border-t border-gray-300">
            <Button bg="bg-gray-400" text="Clear" setIsShow={clearDates} />

            <Button bg="bg-blue-400" text="Done" setIsShow={setIsShow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

export interface CalendarDate {
  day: number;
  disabled: boolean;
}

export const generateCalendar = (
  year: number,
  month: number
): (CalendarDate | null)[][] => {
  const totalDays: number = new Date(year, month + 1, 0).getDate();
  const weeks: (CalendarDate | null)[][] = [];
  let currentWeek: (CalendarDate | null)[] = new Array(7).fill(null);

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dayIndex: number = date.getDay();

    currentWeek[dayIndex] = {
      day,
      disabled: dayIndex === 0 || dayIndex === 6, // Disable weekends
    };

    if (dayIndex === 6 || day === totalDays) {
      weeks.push([...currentWeek]);
      currentWeek = new Array(7).fill(null);
    }
  }

  return weeks;
};

import Calender from "./component/Calender";

const handleDateSelection = ([selectedRange, weekends]: [
  string[],
  string[]
]) => {
  console.log("Selected Range:", selectedRange);
  console.log("Weekends:", weekends);
};

const preDefined = [
  {
    label: "next 7 days",
    value: 7,
  },

  {
    label: "next 5 days",
    value: 5,
  },

  {
    label: "past 5 days",
    value: -5,
  },
];

const App = () => {
  return (
    <div className="flex justify-center mt- h-screen mt-8">
      <Calender onChange={handleDateSelection} range={preDefined} />
    </div>
  );
};

export default App;

import Calender from "./component/Calender";

const handleDateSelection = ([selectedRange, weekends]: [
  string[],
  string[]
]) => {
  console.log("Selected Range:", selectedRange);
  console.log("Weekends:", weekends);
};

const App = () => {
  return (
    <div className="flex justify-center mt- h-screen mt-8">
      <Calender onChange={handleDateSelection} preDefinedRange="this week" />
    </div>
  );
};

export default App;

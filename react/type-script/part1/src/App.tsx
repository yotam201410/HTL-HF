import Content from "./components/Content";
import Header from "./components/Header";

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
    },
  ];

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0
  );

  return (
    <div>
      <Header courseName={courseName} />
      {courseParts.map((coursePart) => (
        <Content
          name={coursePart.name}
          exerciseCount={coursePart.exerciseCount}
        />
      ))}
      <p>Number of exercises {totalExercises}</p>
    </div>
  );
};

export default App;

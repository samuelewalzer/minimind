import React, { useState, useEffect, CSSProperties } from "react";
import TaskContainer from "./components/TaskContainer";
import { useViewService } from "./viewService";
import AddForm from "./components/AddForm";
import TaskForm from "./components/TaskForm";

export default function App() {
  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const { viewMode } = useViewService();

  useEffect(() => {
    // Fetch the initial count when the component mounts
    async function fetchInitialCount() {
      const count = await window.api.getCompletedTodayCount();
      setCompletedTodayCount(count);
    }
    fetchInitialCount();
  }, []);

  const flowerImages = [
    require("./assets/flower_01.png"),
    require("./assets/flower_02.png"),
    require("./assets/flower_03.png"),
    require("./assets/flower_04.png"),
    require("./assets/flower_05.png"),
    require("./assets/flower_06.png"),
  ];

  const getRandomFlower = () => {
    const flowerNumber = Math.floor(Math.random() * 6) + 1;
    const leftPosition = Math.random() * 100;
    const imageUrl = flowerImages[flowerNumber - 1];
    // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
    const imageStyle: CSSProperties = {
      position: "fixed",
      bottom: "30px !important",
      left: leftPosition,
      scale: "0.1",
    };
    return (
      <img src={imageUrl} style={imageStyle} alt="Random Flower" />
    );
  };

  return (
    <div className="appContainer">
      <header className="titleHeader">minimind</header>
      <div className="taskSection">
        <div>
          <TaskContainer />
        </div>
        <div className="formContainer">
          <h2>details</h2>
          {viewMode === "details" ? (
            <TaskForm disabled={true} />
          ) : viewMode === "add" ? (
            <AddForm />
          ) : viewMode === "edit" ? (
            <TaskForm disabled={false} />
          ) : viewMode === "default" ? (
            <h3>no task selected</h3>
          ) : null}
        </div>
      </div>
      <div className="lawnSection"></div>
      <div>Number of tasks completed today: {completedTodayCount}</div>
      {Array(completedTodayCount)
        .fill(null)
        .map((_, index) => {
          const flower = getRandomFlower();
          return <React.Fragment key={index}>{flower}</React.Fragment>;
        })}
    </div>
  );
}
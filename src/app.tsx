import { useState, useEffect } from "react";
import TaskContainer from "./components/TaskContainer";
import { useViewService } from "./viewService";
import AddForm from "./components/AddForm";
import TaskForm from "./components/TaskForm";
import React from "react";

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
    return {
      flowerNumber,
      element: (
        <img
          src={imageUrl}
          style={{
            position: "fixed",
            bottom: 0,
            left: leftPosition,
            scale: "0.1",
          }}
          alt="Random Flower"
        />
      ),
    };
  };

  return (
    <div className="appContainer">
      <header className="titleHeader">minimind</header>
      <div className="taskSection">
        <div>
        <h2 style={{ textAlign: "center" }}>All Tasks</h2>
        <TaskContainer />
        </div>
        <div className="formContainer">
        <h2 style={{ textAlign: "center" }}>Details</h2>
          {viewMode === "details" ? (
            <TaskForm disabled={true} />
          ) : viewMode === "add" ? (
            <AddForm />
          ) : viewMode === "edit" ? (
            <TaskForm disabled={false} />
          ) : viewMode === "default" ? (
            <h2 style={{ textAlign: "center" }}>no task selected</h2>
          ) : null}
        </div>
      </div>
      <div className="lawnSection"></div>
      <div>Number of tasks completed today: {completedTodayCount}</div>
      {Array(completedTodayCount)
        .fill(null)
        .map((_, index) => {
          const flower = getRandomFlower();
          return <React.Fragment key={index}>{flower.element}</React.Fragment>;
        })}
    </div>
  );
}

// <div style={{ display: "flex", height: "80vh" }}>
//   <div style={{ flex: 1 }}>
//     <h2 style={{ textAlign: "center" }}>All Tasks</h2>
//     <TaskContainer />
//   </div>
//   <div style={{ flex: 1 }}>
//     <h2 style={{ textAlign: "center" }}>Details</h2>
//     {viewMode === "details" ? (
//       <TaskForm disabled={true} />
//     ) : viewMode === "add" ? (
//       <AddForm />
//     ) : viewMode === "edit" ? (
//       <TaskForm disabled={false} />
//     ) : viewMode === "default" ? (
//       <h1>No task selected</h1>
//     ) : null}
//   </div>
// </div>
// <div>Number of tasks completed today: {completedTodayCount}</div>
// {Array(completedTodayCount)
//   .fill(null)
//   .map((_, index) => {
//     const flower = getRandomFlower();
//     return <React.Fragment key={index}>{flower.element}</React.Fragment>;
//   })}

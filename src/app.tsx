import React, { useState } from "react";
import TaskContainer from "./components/TaskContainer";
import DetailsContainer from "./components/DetailsContainer";
import tasksList from "./Tasks.json";

export default function App() {
  const [detailsView, setDetailsView] = useState(false);
  const [tasks, setTasks] = useState(tasksList);
  const [task, setTask] = useState("");

  function showDetails(task) {
    setTask(task);
    setDetailsView(true);
  }

  return (
    <>
      <header>
        <h1 style={{ textAlign: "center" }}>minimind</h1>
      </header>
      <div style={{ display: "flex", height: "80vh" }}>
        <div style={{ flex: 1 }}>
          <TaskContainer showDetails={showDetails} tasks={tasks} />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Details</h2>
          {detailsView ? <DetailsContainer task={task}/> : <h1>No task selected</h1>}
        </div>
      </div>
    </>
  );
}

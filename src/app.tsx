import React, { useState } from "react";
import TaskContainer from "./components/TaskContainer";
import tasksList from "./Tasks.json";
import Form from "./components/TaskForm";
import { useViewService } from "./viewService";
import AddForm from "./components/AddForm";
import TaskForm from "./components/TaskForm";


export default function App() {
  const [tasks, setTasks] = useState(tasksList);
  const { viewMode } = useViewService();

  return (
    <>
      <header>
        <h1 style={{ textAlign: "center" }}>minimind</h1>
      </header>
      <div style={{ display: "flex", height: "80vh" }}>
        <div style={{ flex: 1 }}>
        <h2 style={{ textAlign: "center" }}>All Tasks</h2>
          <TaskContainer 
            tasks={tasks}
            setTasks={setTasks}
            />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Details</h2>
          {viewMode === "details" ? <TaskForm disabled={true}/> 
          : viewMode === "add" ? <AddForm /> 
          : viewMode === "edit" ? <TaskForm disabled={false} />
          : viewMode === "default" ? <h1>No task selected</h1> : null}
        </div>
      </div>
    </>
  );
}

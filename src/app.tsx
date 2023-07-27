import React, { useState } from "react";
import TaskContainer from "./components/TaskContainer";
import tasksList from "./Tasks.json";
import Form from "./components/Form";
import { useViewService } from "./viewService";


export default function App() {
  const [tasks, setTasks] = useState(tasksList);
  const { view } = useViewService();

  return (
    <>
      <header>
        <h1 style={{ textAlign: "center" }}>minimind</h1>
      </header>
      <div style={{ display: "flex", height: "80vh" }}>
        <div style={{ flex: 1 }}>
          <TaskContainer 
            tasks={tasks}
            setTasks={setTasks}
            />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Details</h2>
          {view.details ? <Form 
            tasks={tasks} 
            setTasks={setTasks} 
            /> : <h1>No task selected</h1>}
        </div>
      </div>
    </>
  );
}

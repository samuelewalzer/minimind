import React, { useState } from "react";
import TaskContainer from "./components/TaskContainer";
import tasksList from "./Tasks.json";
import Form from "./components/Form";

export default function App() {
  const [formVis, setFormVis] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [tasks, setTasks] = useState(tasksList);
  const [task, setTask] = useState({
    name: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    subtasks: [],
    notes: "",
  });

  function showDetails(id:string) {
    setTask(tasks.find((task) => task.id === id));

    setFormVis(true);
  }

  return (
    <>
      <header>
        <h1 style={{ textAlign: "center" }}>minimind</h1>
      </header>
      <div style={{ display: "flex", height: "80vh" }}>
        <div style={{ flex: 1 }}>
          <TaskContainer 
            showDetails={showDetails} 
            tasks={tasks}
            setTasks={setTasks}
            setFormVis={setFormVis}
            setEditing={setEditing}
            />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ textAlign: "center" }}>Details</h2>
          {formVis ? <Form 
            tasks={tasks} 
            setTasks={setTasks} 
            setFormVis={setFormVis}
            isEditing={isEditing}
            setEditing={setEditing}
            /> : <h1>No task selected</h1>}
        </div>
      </div>
    </>
  );
}

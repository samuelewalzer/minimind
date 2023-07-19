import React, { useState } from "react";

export default function TaskItem(props) {
  const [newName, setNewName] = useState("");

  function handleChange(e) {
    setNewName(e.target.value);
  }

  function handleSubmit(e) {
    if (!newName) {
      alert("Please enter a new task name");
      return;
    }
    e.preventDefault();
    props.editTask(props.id, newName);
    setNewName("");
    props.setEditing(false);
  }

  function handleClick() {
    props.showDetails(props.id);
    props.setEditing(false);
  }

  return (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onChange={() => props.toggleTaskCompleted(props.id)}
        />
        <label className="todo-label" htmlFor={props.id} onClick={handleClick}>
          {props.name}
        </label>
      </div>
    </div>
  );
}

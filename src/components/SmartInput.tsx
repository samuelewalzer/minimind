import { nanoid } from "nanoid";
import { Subtask } from "../appStore";
import { useState } from "react";

export default function SmartInput(props) {
  
  function handleClick(e) {
    if (!props.input) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    checkForSubtasks();
  }
  
  async function checkForSubtasks() {
  try {
    const response = await window.api.addSmartResponse(props.input.name);
    handleSubtasksResponse(response);
  } catch (error) {
    console.log(error);
  }
}

function handleSubtasksResponse(response) {
  if (response.subtasks.length === 0) {
    alert("Your task is of optimal length. Our AI doesn't suggest any subtasks");
    return;
  }
  const userResponse = window.confirm("Our AI suggests some subtasks. Do you want to see them?");
  if (userResponse) {
    props.setSubtasks([])
    response.subtasks.forEach((subtask: Subtask) => {
      props.setSubtasks((prevSubtasks: []) => [
        ...prevSubtasks,
        {
          id: `smartsubtask-${nanoid()}`,
          name: subtask.name,
          completed: false,
          parentTaskId: props.parentTaskId,
        },
      ]);
    });
  }
}

  return (
    <>
     <input
        type="text"
        id="name"
        className="input input__lg"
        autoComplete="off"
        placeholder="Type your task title here"
        value={props.input.name}
        onChange={props.handleChange}
        onBlur={handleClick}
      />
        <button type="submit" className="btn" onClick={handleClick}>
          check subtask suggestions
        </button>
    </>
  );
}
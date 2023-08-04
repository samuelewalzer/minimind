import { nanoid } from "nanoid";
import { useState } from "react";

export default function SmartInput(props) {
  const [smartInput, setSmartInput] = useState("");

  function handleChange(e) {
    setSmartInput(e.target.value);
  }

  function handleClick(e) {
    if (!smartInput) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    getSmartResponse();
  }
  
  async function getSmartResponse() {
    if (!smartInput) {
      alert("Plase enter a smart task name");
      return;
    }
    try {
      const response = await window.api.addSmartResponse(smartInput);
      props.setSmartResponse({
        ...props.smartResponse,
        name: response.name,
        completed: response.completed,
        probability: response.probability,
        subtasks: response.subtasks,
      });
      parseSmartResponse(response)
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  function parseSmartResponse(response) {
    if (response.subtasks.length > 0) {
      response.subtasks.forEach((subtask) => {
        props.setSubtasks((prevSubtasks) => [
          ...prevSubtasks,
          {
            id: `smartsubtask${nanoid()}`,
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
      <div className="input-container">
        <input
          type="text"
          id="name"
          className="input input__lg"
          autoComplete="off"
          placeholder="SmartInput"
          value={smartInput}
          onChange={(handleChange)}
        />
        <button type="submit" className="btn" onClick={handleClick}>
          check
        </button>
      </div>
      Subtasks: {}
    </>
  );
}

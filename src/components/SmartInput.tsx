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
    const data = setSmartResponse(smartInput);
  }
  
  async function setSmartResponse(smartInput: string) {
    try {
      const response = await window.api.addSmartResponse(smartInput);
      props.setSmartResponse({
        ...props.smartResponse,
        name: response.name,
        completed: response.completed,
        probability: response.probability,
        subtasks: response.subtasks,
      });
    } catch (error) {
      console.log(error);
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

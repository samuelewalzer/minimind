import { nanoid } from "nanoid";
import { SmartResponse, Subtask } from "../appStore";
import { ChangeEventHandler, useState } from "react";

export default function SmartInput(props: {smartInput: string ; subtasks: Subtask[]; setSubtasks: (subtasks: Subtask[]) => void; parentTaskId: string; handleChange: ChangeEventHandler<HTMLInputElement>; }) {
  const [isLoading, setIsLoading] = useState(false);
  
  function handleClick(e: { preventDefault: () => void; }) {
    if (!props.smartInput) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    checkForSubtasks();
  }
  
  async function checkForSubtasks() {
    setIsLoading(true);
  try {
    const response: SmartResponse = await window.api.addSmartResponse(props.smartInput);
    handleSubtasksResponse(response);
  } catch (error) {
    alert("Error getting subtasks. Please try again!");
    console.log(error);
  } finally {
    setIsLoading(false);
  }
}

function handleSubtasksResponse(response: SmartResponse) {
  if (response.subtasks.length === 0) {
    alert("The AI doesn't suggest any subtasks");
    return;
  }
  const userResponse = window.confirm("Our AI suggests some subtasks. Do you want to see them?");
  if (userResponse) {

    const newSubtasks = response.subtasks.map((subtask: Subtask) => ({
      id: `smartsubtask-${nanoid()}`,
          createdDate: new Date().toISOString(),
          name: subtask.name,
          completed: false,
          completedDate: "",
          parentTaskId: props.parentTaskId,
          deleted: false,
    }));
    props.setSubtasks(newSubtasks);
  }
}

  return (
    <div className={isLoading ? "loading-cursos": ""}>
     <input
        type="text"
        id="name"
        className="input input__lg"
        autoComplete="off"
        placeholder="Type your task title here"
        value={props.smartInput}
        onChange={props.handleChange}
        onBlur={handleClick}
        disabled={isLoading}
      />
        <button type="submit" className="btn" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "check subtask suggestions"}
        </button>
    </div>
  );
}
import { nanoid } from "nanoid";
import { Subtask } from "../appStore";

export default function SmartInput(props) {

  function handleClick(e) {
    if (!props.input) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    getSmartResponse();
  }
  
  async function getSmartResponse() {
    try {
      const response = await window.api.addSmartResponse(props.input);
      if (response.subtasks.length === 0) {
        alert("Your task is of optimal length. Our AI doesn't suggest any subtasks");
      }
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
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="input-container">
        <button type="submit" className="btn" onClick={handleClick}>
          check subtask suggestions
        </button>
      </div>
    </>
  );
}

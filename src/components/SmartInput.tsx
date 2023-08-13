import { nanoid } from "nanoid";
import { Task, Subtask, SmartResponse, SubtaskSuggestion } from "../appStore";

export default function SmartInput(props: { input: Task; subtasks: Subtask[], setSubtasks: (arg0: Subtask[]) => void; parentTaskId: string; }) {

  function handleClick(e: { preventDefault: () => void; }) {
    if (!props.input) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    getSmartResponse();
  }
  
  async function getSmartResponse() {
    try {
      const response: SmartResponse = await window.api.addSmartResponse(props.input.name);
      if( response !== null && typeof response === 'object' && 'subtasks' in response) {
        if ( response.subtasks.length === 0) {
          alert("Your task is of optimal length. Our AI doesn't suggest any subtasks");
        }
        props.setSubtasks([])
        const newSubtasks = response.subtasks.map((subtask: SubtaskSuggestion) => ({
          id: `smartsubtask-${nanoid()}`,
          createdDate: "",
          name: subtask.name,
          completed: false,
          completedDate: "",
          parentTaskId: props.parentTaskId,
        }));
        
        props.setSubtasks({
          ...props.subtasks,
          ...newSubtasks
        });
      }
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

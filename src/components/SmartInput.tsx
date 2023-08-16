import { nanoid } from "nanoid";
import { SmartResponse, Subtask } from "../appStore";
import { ChangeEventHandler, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function SmartInput(props: {
  smartInput: string;
  subtasks: Subtask[];
  setSubtasks: (subtasks: Subtask[]) => void;
  parentTaskId: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  setAddBtnDisabled: (arg0: boolean) => void;
}) {
  const [tempSubtasks, setTempSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
  })

  function handleClick(e: { preventDefault: () => void }) {
    if (!props.smartInput) {
      alert("Plase enter a task name");
      return;
    }
    e.preventDefault();
    checkForSubtasks();
  }

  async function checkForSubtasks() {
    setIsLoading(true);
    props.setAddBtnDisabled(true);
    try {
      const TIMEOUT_DURATIOON = 7000;
      const timeout = new Promise<SmartResponse>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_DURATIOON)
      );

      const response: SmartResponse = await Promise.race([
        window.api.addSmartResponse(props.smartInput),
        timeout
      ]);

      console.log(response)
      handleSubtasksResponse(response);
    } catch (error) {
      alert(`Error getting subtasks: ${error.message}. Please try again!`);
      console.log(error);
    } finally {
      setIsLoading(false);
      props.setAddBtnDisabled(false);
    }
  }

  function handleSubtasksResponse(response: SmartResponse) {
    
    const newSubtasks = response.subtasks.map((subtask: Subtask) => ({
      id: `smartsubtask-${nanoid()}`,
      createdDate: new Date().toISOString(),
      name: subtask.name,
      completed: false,
      completedDate: "",
      parentTaskId: props.parentTaskId,
      deleted: false,
    }));
    setTempSubtasks(newSubtasks);

    if (response.subtasks.length === 0) {
      setConfirmation({
        title: "Good task size!",
        message: "The AI doesn’t suggest any subtasks!",
        showDialog: true,
        showConfirmButton: false,
      })
    } else if (response.probability < 30) {
      const subtaskNames = newSubtasks.map(subtask => `• ${subtask.name}`).join("\n");
      setConfirmation({
        title: "Your task is too big!",
        message: `The AI suggest to split up the task. Here are some suggestions: \n${subtaskNames}`,
        showDialog: true,
        showConfirmButton: false,
      })
      window.confirm(`The AI suggest to split up the task. Here are some suggestions: \n${subtaskNames}However, these are still too big so use them as suggestion for a task title`)
    } else {
      setConfirmation({
        title: "Your task is big!",
        message: "The AI suggests to add subtasks. Do you want to add them?",
        showDialog: true,
        showConfirmButton: true,
      })
    }
  }

  return (
      <><ConfirmDialog
      isOpen={confirmation.showDialog}
      title={confirmation.title}
      message={confirmation.message}
      showConfirmButton={confirmation.showConfirmButton}
      onConfirm={() => {
        setConfirmation({
          ...confirmation,
          showDialog: false
        });
        props.setSubtasks([...props.subtasks, ...tempSubtasks]);
      } }
      onCancel={() => {
        setConfirmation({
          ...confirmation,
          showDialog: false
        });
      } } /><div className={isLoading ? "loading-cursor" : ""}>
        <input
          type="text"
          id="name"
          className="input input__lg"
          autoComplete="off"
          placeholder="Type your task title here"
          value={props.smartInput}
          onChange={props.handleChange}
          onBlur={handleClick}
          disabled={isLoading} />
        <button
          type="submit"
          className="btn"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "check subtask suggestions"}
        </button>
      </div></>
  );
}

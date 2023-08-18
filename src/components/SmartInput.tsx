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
      setConfirmation({
        title: "No task name!",
        message: "Please enter a task name",
        showDialog: true,
        showConfirmButton: false,
      })
      return;
    }
    e.preventDefault();
    checkForSubtasks();
  }

  async function checkForSubtasks() {
    setIsLoading(true);
    props.setAddBtnDisabled(true);
    try {
      const TIMEOUT_DURATIOON = 8000;
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
      setConfirmation({
        title: "Error!",
        message: `${error.message}. Please try again!`,
        showDialog: true,
        showConfirmButton: false,
      })
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
    } else if (response.probability < 50) {
      const subtaskNames = newSubtasks.map(subtask => `• ${subtask.name}`).join("\n");
      setConfirmation({
        title: "Your task is too big!",
        message: `The AI suggest to split up the task. Here are some suggestions: \n${subtaskNames}`,
        showDialog: true,
        showConfirmButton: false,
      })
    } else {
      setConfirmation({
        title: "Your task is big!",
        message: "The AI suggests to add subtasks. Do you want to add them?",
        showDialog: true,
        showConfirmButton: true,
      })
    }
  }

  function handleConfirm() {
    setConfirmation({
      ...confirmation,
      showDialog: false
    });
    props.setSubtasks(tempSubtasks);
    setTempSubtasks([]);
  }

  function handleCancel() {
    setConfirmation({
      ...confirmation,
      showDialog: false
    });
  }

  return (
      <><ConfirmDialog
      isOpen={confirmation.showDialog}
      title={confirmation.title}
      message={confirmation.message}
      showConfirmButton={confirmation.showConfirmButton}
      onConfirm={handleConfirm}
      onCancel={handleCancel} />
      <form onSubmit={handleClick} className={isLoading ? "loading-cursor" : ""}>
        <div className="input-container">
        <input
          type="text"
          id="name"
          className="input input__lg"
          autoComplete="off"
          placeholder="Type your task title here"
          value={props.smartInput}
          onChange={props.handleChange}
          disabled={isLoading} />

        <button
          type="submit"
          className="btn btn__smAdd"
          onClick={handleClick}
          disabled={isLoading}
          >
          {isLoading ? "Loading..." : "check"}
        </button>
          </div>
      </form></>
  );
}

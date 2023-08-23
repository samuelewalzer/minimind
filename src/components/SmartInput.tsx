import { nanoid } from "nanoid";
import { SmartResponse, SmartSubtask, Subtask } from "../appStore";
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
  const [response, setResponse] = useState<SmartResponse>(null);
  const [tempSubtasks, setTempSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
  });
  const [goodHint, setGoodHint] = useState(false);
  const [badHint, setBadHint] = useState(false);

  function handleClick(e: { preventDefault: () => void; stopPropagation: () => void; }) {
    e.preventDefault();
    e.stopPropagation();
    setBadHint(false);
    setGoodHint(false);
    if (!props.smartInput) {
      setConfirmation({
        title: "No task name!",
        message: "Please enter a task name",
        showDialog: true,
        showConfirmButton: false,
      });
    } else if (props.smartInput) {
      checkForSubtasks("click");
    }
  }

  function handleBlur(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setBadHint(false);
    setGoodHint(false);
    if (props.smartInput) {
      checkForSubtasks("blur");
    }
  }

  async function checkForSubtasks(handlerType: string) {
    if (handlerType === "click") {
      setIsLoading(true);
      props.setAddBtnDisabled(true);
    }
    try {
      const TIMEOUT_DURATIOON = 10000;
      const timeout = new Promise<SmartResponse>((_, reject) =>
        setTimeout(
          () => reject(new Error("Request timed out")),
          TIMEOUT_DURATIOON
        )
      );

      const response: SmartResponse = await Promise.race([
        window.api.addSmartResponse(props.smartInput),
        timeout,
      ]);

      setResponse(response);
      console.log(response);

      if (handlerType === "click") handleSubtasksResponse(response);

      else if (handlerType === "blur") {
        if (response.subtasks.length > 0) setBadHint(true);
        else setGoodHint(true);
      } 
    } catch (error) {
      setConfirmation({
        title: "Error!",
        message: `The AI has encountered an issue. Please try again!`,
        showDialog: true,
        showConfirmButton: false,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
      props.setAddBtnDisabled(false);
    }
  }

  async function handleHintConfirm(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const newSubtasks = response.subtasks.map((subtask: SmartSubtask) => ({
      id: `smartsubtask-${nanoid()}`,
      createdDate: new Date().toISOString(),
      name: subtask.name,
      completed: false,
      completedDate: "",
      parentTaskId: props.parentTaskId,
      deleted: false,
    }));
    props.setSubtasks(newSubtasks);
    setTempSubtasks([]);
  }

  function handleSubtasksResponse(response: SmartResponse) {
    const newSubtasks = response.subtasks.map((subtask: SmartSubtask) => ({
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
      });
    } else if (response.probability < 50) {
      const subtaskNames = newSubtasks
        .map((subtask) => `• ${subtask.name}`)
        .join("\n");
      setConfirmation({
        title: "Your task is too big!",
        message: `The AI suggest to split up the task. Here are some suggestions: \n${subtaskNames}`,
        showDialog: true,
        showConfirmButton: false,
      });
    } else {
      setConfirmation({
        title: "Your task is big!",
        message: "The AI suggests to add subtasks. Do you want to add them?",
        showDialog: true,
        showConfirmButton: true,
      });
    }
  }

  function handleDialogConfirm() {
    setConfirmation({
      ...confirmation,
      showDialog: false,
    });
    props.setSubtasks(tempSubtasks);
    setTempSubtasks([]);
  }

  function handleDialogCancel() {
    setConfirmation({
      ...confirmation,
      showDialog: false,
    });
  }

  return (
    <>
      <ConfirmDialog
        isOpen={confirmation.showDialog}
        title={confirmation.title}
        message={confirmation.message}
        showConfirmButton={confirmation.showConfirmButton}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />
      <form
        onSubmit={handleClick}
        className={isLoading ? "loading-cursor" : ""}
      >
        <label htmlFor="title" className="label_title">
          title
        </label>
        <div className="input-container">
          <input
            type="text"
            id="name"
            className="input input__lg"
            autoComplete="off"
            placeholder="Type your task title here"
            value={props.smartInput}
            onChange={props.handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="btn small"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "check"}
          </button>
        </div>
        <div className={`hint-score ${badHint?'bad':'good'}`}>
          {goodHint && "Good task size :) "}
          {badHint && "The AI suggests adding subtasks!"}
          {badHint && (
            <button className="link" onClick={handleHintConfirm}>
              Show me the suggestions
            </button>
          )}
        </div>
      </form>
    </>
  );
}

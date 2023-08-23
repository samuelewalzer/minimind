import { nanoid } from "nanoid";
import { SmartResponse, SmartSubtask, Subtask } from "../appStore";
import { ChangeEventHandler, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function SmartInput(props: {
  smartInput: string;
  subtasks: Subtask[];
  setCheckCount: (count: number) => void;
  setSubtasks: (subtasks: Subtask[]) => void;
  parentTaskId: string;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  setAddBtnDisabled: (arg0: boolean) => void;
}) {
  const [response, setResponse] = useState<SmartResponse>(null);
  const [tempSubtasks, setTempSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [requestId] = useState(`request-${nanoid()}`);
  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
  });
  const [goodHint, setGoodHint] = useState(false);
  const [badHint, setBadHint] = useState(false);
  const [ suggestionsHint, setSuggestionsHint] = useState(false);

  function handleClick(e: { preventDefault: () => void; stopPropagation: () => void; }) {
    e.preventDefault();
    e.stopPropagation();
    setBadHint(false);
    setGoodHint(false);
    setSuggestionsHint(false);
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
    if(checkCount === 0) {
      e.preventDefault();
      setBadHint(false);
      setGoodHint(false);
      setSuggestionsHint(false);
      if (props.smartInput) {
        checkForSubtasks("blur");
      }
      setCheckCount(checkCount + 1);
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
        window.api.addSmartResponse(props.smartInput, requestId),
        timeout,
      ]);
      setResponse(response);
      console.log(response);

      if (handlerType === "click") handleSubtasksClick(response);
      else if ( handlerType === "blur") handleSubtasksBlur(response);
      
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

  function handleSubtasksBlur(response: SmartResponse) {
      if (response.subtasks.length === 0) setGoodHint(true);
      else if (response.probability < 50) setBadHint(true);
      else setSuggestionsHint(true);
    } 

  function handleSuggestionHint(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const newSubtasks = response.subtasks.map((subtask: SmartSubtask) => ({
      id: subtask.id,
      createdDate: subtask.createdDate,
      name: subtask.name,
      completed: false,
      completedDate: "",
      parentTaskId: subtask.parentTaskId,
      deleted: false,
    }));
    props.setCheckCount(checkCount);
    props.setSubtasks(newSubtasks);
  }

  function handleBadHint(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const subtaskNames = response.subtasks
        .map((subtask) => `• ${subtask.name}`)
        .join("\n");
      setConfirmation({
        title: "Your task is too big!",
        message: `The AI suggest to split up the task. Here are some suggestions: \n${subtaskNames}`,
        showDialog: true,
        showConfirmButton: false,
      });
      setCheckCount(checkCount + 1);
    }
    
  function handleSubtasksClick(response: SmartResponse) {
    const newSubtasks = response.subtasks.map((subtask: SmartSubtask) => ({
      id: subtask.id,
      createdDate: subtask.createdDate,
      name: subtask.name,
      completed: false,
      completedDate: "",
      parentTaskId: subtask.parentTaskId,
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
    setCheckCount(checkCount + 1);
  }

  function handleDialogConfirm() {
    setConfirmation({
      ...confirmation,
      showDialog: false,
    });
    props.setCheckCount(checkCount);
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
            {isLoading ? "Loading..." : checkCount === 0 ? "check" : "recheck"}
          </button>
        </div>
        <div className={`hint-score ${badHint || suggestionsHint ?'bad':'good'}`}>
          {goodHint && "Good task size :) "}
          {suggestionsHint && "The AI suggests adding subtasks!"}
          {suggestionsHint && (
            <button className="link" onClick={handleSuggestionHint}>
            Show me the suggestions
            </button>
            )}
          {badHint && "Your task is too big, split it up!"}
          {badHint && (
            <button className="link" onClick={handleBadHint}>
            Show me the suggestions
            </button>
            )}
        </div>
      </form>
    </>
  );
}

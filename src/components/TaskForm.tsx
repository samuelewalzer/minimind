import { useState, useEffect } from "react";
import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";

import SubtaskContainer from "./SubtaskContainer";

import { Task } from "../appStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

// Form for viewing details of a task and editing it
export default function TaskForm(props: { disabled: boolean }) {
  const { viewMode, currentTask, setEditView, setDefaultView, setDetailsView } =
    useViewService();

  const { toggleRerender, triggerRerender } = useGlobalRerender();
  const [currentSubtasks, setCurrentSubtasks] = useState([]);
  const [dateString, setDateString] = useState("");

  const [input, setInput] = useState({
    name: "",
    deadline: "",
    priority: "",
    subtasks: [],
    notes: "",
  });

  // every time the current task changes, we set the inputs of the form new
  useEffect(() => {
    setInput({
      name: currentTask.name,
      deadline: currentTask.deadline,
      priority: currentTask.priority,
      subtasks: currentSubtasks,
      notes: currentTask.notes,
    });
  }, [currentTask, currentSubtasks]);

  // every time we set a new currenttask, fetch the subtasks of given task
  useEffect(() => {
    async function fetchSubtasks() {
      try {
        const response = await window.api.getSubtasksFromParent(currentTask.id);
        setCurrentSubtasks(response);
        console.log("Fetching subtasks from database");
      } catch (error) {
        console.log("Error fetching subtasks:", error);
      }
    }
    fetchSubtasks();
  }, [currentTask, viewMode]);

  useEffect(() => {
    if (input.deadline) {
      const date = new Date(input.deadline);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      setDateString(`${year}-${month}-${day}`);
    } else {
      setDateString("");
    }
  }, [input.deadline]);

  function handleChange(e: { target: { id: string; value: string } }) {
    if (e.target.id === "deadline") {
      setInput({
        ...input,
        deadline: e.target.value,
      });
      return;
    }
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    if (!input.name) {
      alert("Please enter a task name");
    }
    e.preventDefault();
    const editedTask: Task = {
      id: currentTask.id,
      createdDate: currentTask.createdDate,
      name: input.name,
      completed: currentTask.completed,
      completedDate: currentTask.completedDate,
      deadline: input.deadline,
      priority: input.priority,
      subtasks: currentSubtasks,
      notes: input.notes,
      checkCount: currentTask.checkCount,
    };
    window.api.editTask(editedTask);
    console.log("Edited task:", editedTask);
    setDetailsView(editedTask);
  }

  function handleDelete() {
    window.api.deleteTask(currentTask.id);
    setDefaultView();
  }

  function handleEdit() {
    setEditView();
  }

  function handleCancel() {
    setDetailsView(currentTask);
  }

  function handleXmark() {
    setDefaultView();
  }

  const viewTemplate = (
    <div className="btn-group">
      <button type="button" className="btn" onClick={handleEdit}>
        edit
      </button>
      <button type="button" className="btn danger" onClick={handleDelete}>
        delete
      </button>
    </div>
  );

  const editTemplate = (
    <div className="btn-group">
      <button type="button" className="btn btn__danger" onClick={handleCancel}>
        cancel
      </button>
      <button type="submit" className="btn btn__add" onClick={handleSubmit}>
        submit
      </button>
    </div>
  );

  return (
    <>
      {props.disabled ? <h2>{input.name}</h2> : ""}
      <FontAwesomeIcon
        icon={faXmark}
        className={"faXmark"}
        onClick={handleXmark}
      />
      <form className="input-form">
        {!props.disabled && (
          <label htmlFor="title" className="label_title">
            name
            <input
              type="text"
              id="name"
              className="input input__lg"
              autoComplete="off"
              placeholder={input.name}
              disabled={props.disabled}
              value={input.name}
              onChange={handleChange}
            />
          </label>
        )}
        <div>
          <div>
            <SubtaskContainer
              subtasks={currentSubtasks}
              setSubtasks={setCurrentSubtasks}
              parentTaskId={currentTask.id}
            />
          </div>
          <div className="input-group">
            <label htmlFor="deadline" className="label_title">
              deadline
              <input
                type="date"
                id="deadline"
                className="input input__lg"
                disabled={props.disabled}
                value={dateString}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="priority" className="label_title">
              priority
              <select
                name="priority"
                id="priority"
                className="input input__lg"
                disabled={props.disabled}
                value={input.priority}
                onChange={handleChange}
              >
                <option value="low">low</option>
                <option value="middle">middle</option>
                <option value="high">high</option>
              </select>
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="label_title">
            notes
            <input
              type="text"
              id="notes"
              className="input input__lg"
              autoComplete="off"
              disabled={props.disabled}
              placeholder="None"
              value={input.notes}
              onChange={handleChange}
            />
          </label>
        </div>
        {viewMode === "edit" ? editTemplate : null}
        {viewMode === "details" ? viewTemplate : null}
      </form>
    </>
  );
}

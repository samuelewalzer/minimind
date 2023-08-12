import { useState, useEffect } from "react";
import { Task } from "../appStore";
import { useViewService } from "../viewService";
import SubtaskContainer from "./SubtaskContainer";

// Form for viewing details of a task and editing it
export default function TaskForm(props) {
  const { viewMode, currentTask, setEditView, setDefaultView } = useViewService();
  const [subtasks, setSubtasks] = useState([]);
  const debug = 0;

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
      subtasks: subtasks,
      notes: currentTask.notes,
    });
  }, [currentTask]);

  // every time we set a new currenttask, fetch the subtasks of given task
  useEffect(() => {
    async function fetchSubtasks() {
      try {
        {debug ? console.log("(TaskForm) currentTask: ", currentTask) : null}
        const response = await window.api.getSubtasksFromParent(currentTask.id);
        console.log("(TaskForm) response: ", response);
        setSubtasks(response);
      } catch (error) {
        console.log("Error fetching subtasks:", error);
      }
    }
    fetchSubtasks();
  }, [currentTask]);

  const [dateString, setDateString] = useState("");
  useEffect(() => {
    const date = new Date(input.deadline);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    setDateString(`${year}-${month}-${day}`);
  }, [input.deadline]);

  function handleChange(e: any) {
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

  function handleSubmit(e) {
    if (!input.name) {
      alert("Please enter a task name");
      return;
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
      subtasks: subtasks,
      notes: input.notes,
    };

    window.api.editTask(editedTask);
    setSubtasks([]);
    setDefaultView();
  }

  function handleDelete(e) {
    window.api.deleteTask(currentTask.id);
    setDefaultView();
  }

  const viewTemplate = (
    <div className="btn-group">
      <button type="button" className="btn" onClick={() => setEditView()}>
        edit
        <span className="visually-hidden">{props.name}</span>
      </button>
      <button type="button" className="btn btn__danger" onClick={handleDelete}>
        delete <span className="visually-hidden">{props.name}</span>
      </button>
    </div>
  );

  const editTemplate = (
    <div className="btn-group">
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => setDefaultView()}
      >
        cancel
      </button>
      <button type="submit" className="btn btn__add" onClick={handleSubmit}>
        submit
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <label htmlFor="title" className="label_title" onClick={() => setEditView()}>
        title
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
      <div>
        <div>
        <SubtaskContainer subtasks={subtasks} setSubtasks={setSubtasks} parentTaskId={currentTask.id}/>
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
      {viewMode === "edit" ? editTemplate
        : viewMode === "details" ? viewTemplate
        : null}
    </form>
  );
}


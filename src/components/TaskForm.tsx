import { useState, useEffect } from "react";
import { Task } from "../appStore";
import { useViewService } from "../viewService";
import SubtaskContainer from "./SubtaskContainer";

// Form for viewing details of a task and editing it
export default function TaskForm(props: any) {
  const { viewMode, currentTask, setEditView, setDefaultView, setDetailsView } = useViewService();
  const [subtasks, setSubtasks] = useState([]);

  const [input, setInput] = useState({
    name: "",
    deadline: new Date(),
    priority: "",
    subtasks: [],
    notes: "",
  });

  useEffect(() => {
    setInput({
      name: currentTask.name,
      deadline: new Date(currentTask.deadline),
      priority: currentTask.priority,
      subtasks: currentTask.subtasks,
      notes: currentTask.notes,
    });
  }, [currentTask]);

  const year = input.deadline.getFullYear();
  const month = (input.deadline.getMonth() + 1).toString().padStart(2, "0");
  const day = input.deadline.getDate().toString().padStart(2, "0");
  const dateString = `${year}-${month}-${day}`;

  function handleChange(e: any) {
    if (e.target.id === "deadline") {
      setInput({
        ...input,
        deadline: new Date(e.target.value),
      });
      return;
    }
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }

  useEffect(() => {
    async function fetchSubtasks() {
      try {
        const response = await window.api.getSubtasksFromParent(currentTask.id);
        setSubtasks(response);
      } catch (error) {
        console.log("Error fetching subtasks:", error);
      }
    }
    fetchSubtasks();
  }, [input]);

  function handleSubmit(e) {
    if (!input.name) {
      alert("Please enter a task name");
      return;
    }
    e.preventDefault();
    const editedTask: Task = {
      id: currentTask.id,
      completed: currentTask.completed,
      name: input.name,
      deadline: new Date(input.deadline),
      priority: input.priority,
      subtasks: input.subtasks,
      notes: input.notes,
    };

    window.api.editTask(editedTask);
    setDetailsView(currentTask);
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
      <button type="submit" className="btn btn__add">
        submit
      </button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <label htmlFor="title" className="label_details">
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
        <SubtaskContainer subtasks={subtasks} setSubtasks={setSubtasks} />
      </div>
      <div className="input-group">
        <label htmlFor="deadline" className="label_details">
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
        <label htmlFor="priority" className="label_details">
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
        <label htmlFor="notes" className="label_details">
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
      {viewMode === "edit"
        ? editTemplate
        : viewMode === "details"
        ? viewTemplate
        : null}
    </form>
  );
}

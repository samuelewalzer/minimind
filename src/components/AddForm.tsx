import { useState } from "react";
import { nanoid } from "nanoid";
import { Task } from "../appStore";
import { useViewService } from "../viewService";

export default function AddForm() {
  const { setDefaultView } = useViewService();

  const [input, setInput] = useState({
    name: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    subtasks: [],
    notes: "",
  });

  function handleChange(e: any) {
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
    const newTask: Task = {
      id: `task-${nanoid()}`,
      name: input.name,
      completed: false,
      deadline: new Date(input.deadline),
      priority: input.priority,
      subtasks: input.subtasks,
      notes: input.notes,
    };
    
    window.api.addTask(newTask);
    setDefaultView();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="name"
        className="input input__lg"
        autoComplete="off"
        placeholder=  "Type your task title here"
        value={input.name}
        onChange={handleChange}
      />
      <div className="input-group">
        <label htmlFor="deadline">
          Deadline
          <input
            type="date"
            id="deadline"
            className="input input__lg"
            value={input.deadline}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="priority">
          Priority
          <select
            name="priority"
            id="priority"
            className="input input__lg"
            value={input.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Middle">Middle</option>
            <option value="High">High</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="subtasks">Subtasks</label>
      </div>
      <div>
        <label htmlFor="notes">
          Notes
          <input
            type="text"
            id="notes"
            className="input input__lg"
            autoComplete="off"
            placeholder="Type your notes here"
            value={input.notes}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="btn-group">
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => setDefaultView()}
      >
        Cancel
      </button>
      <button type="submit" className="btn btn__add">
        Add
      </button>
    </div>
    </form>
  );
}
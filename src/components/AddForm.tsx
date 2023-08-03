import { useState } from "react";
import { nanoid } from "nanoid";
import { Task } from "../appStore";
import { useViewService } from "../viewService";
import SmartInput from "./SmartInput";
import SubtaskContainer from "./SubtaskContainer";

export default function AddForm() {
  const { setDefaultView } = useViewService();
  const [smartResponse, setSmartResponse] = useState({
    name: String,
    completed: false,
    probability: Number,
    subtasks: [],
  });
  const [subtasks, setSubtasks] = useState([]);

  const [input, setInput] = useState({
    id: `task-${nanoid()}`,
    completed: false,
    name: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    notes: "",
    subtasks: subtasks,
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
      id: input.id,
      name: input.name,
      completed: false,
      deadline: new Date(input.deadline),
      priority: input.priority,
      subtasks: subtasks,
      notes: input.notes,
    };

    window.api.addTask(newTask);
    setDefaultView();
  }

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <label htmlFor="title">
        title
        <input
          type="text"
          id="name"
          className="input input__lg"
          autoComplete="off"
          placeholder="Type your task title here"
          value={input.name}
          onChange={handleChange}
        />
        <SmartInput smartResponse={smartResponse} setSmartResponse={setSmartResponse}/>
        </label>
      <div>
        <SubtaskContainer subtasks={subtasks} setSubtasks={setSubtasks} parentTaskId={input.id}/>
      </div>
      <div className="input-group">
        <label htmlFor="deadline">
          deadline
          <input
            type="date"
            id="deadline"
            className="input input__lg"
            // TODO: deadline must not necessarily be set
            value={input.deadline}
            onChange={handleChange}
            />
        </label>   
        <label htmlFor="priority">
          priority
          <select
            name="priority"
            id="priority"
            className="input input__lg"
            value={input.priority}
            onChange={handleChange}
            >
            <option value="low">low</option>
            <option value="middle">middle</option>
            <option value="high">high</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="notes">
          notes
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
          cancel
        </button>
        <button type="submit" className="btn btn__add">
          add
        </button>
      </div>
    </form>
  );
}

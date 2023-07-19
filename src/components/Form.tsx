import React, { useState } from "react";
import { nanoid } from "nanoid";

export default function Form(props: any) {
  const [input, setInput] = useState({
    name: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    subtasks: [],
    notes: "",
  });

  function handleSubmit(e) {
    if (!input.name) {
      alert("Please enter a task name");
      return;
    }
    e.preventDefault();
    addTask(
      input.name,
      input.deadline,
      input.priority,
      input.subtasks,
      input.notes
    );
    props.setFormVis(false);
    setInput({
      ...input,
      [e.target.id]: "",
    });
  }

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }

  function addTask(
    name: string,
    deadline: string,
    priority: string,
    subtasks: string[],
    notes: string
  ) {
    const newTask = {
      id: `task-${nanoid()}`,
      name,
      completed: false,
      deadline,
      priority,
      subtasks,
      notes,
    };
    props.setTasks([...props.tasks, newTask]);
  }

  function deleteTask(id: string) {
    const remainingTasks = props.tasks.filter((task) => id !== task.id);
    props.setTasks(remainingTasks);
  }

  function editTask(id: string, newName: string) {
    const editedTaskList = props.tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    props.setTasks(editedTaskList);
  }

  const viewTemplate = (
    <div className="btn-group">
      <button type="button" className="btn" onClick={() => props.setEditing(true)}>
        Edit
        <span className="visually-hidden">{props.name}</span>
      </button>
      <button
        type="button"
        className="btn btn__danger"
        onClick={() => deleteTask(props.id)}
      >
        Delete <span className="visually-hidden">{props.name}</span>
      </button>
    </div>
  );

  const editTemplate = (
    <div className="btn-group">
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => props.setFormVis(false)}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn__add">
          Add
        </button>
      </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="name"
        className="input input__lg"
        autoComplete="off"
        placeholder="Type your task title here"
        disabled={!props.isEditing}
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
            disabled={!props.isEditing}
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
            disabled={!props.isEditing}
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
            disabled={!props.isEditing}
            placeholder="Type your notes here"
            value={input.notes}
            onChange={handleChange}
          />
        </label>
      </div>
      {props.isEditing ? editTemplate : viewTemplate}
    </form>
  );
}

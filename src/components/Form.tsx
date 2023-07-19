import React, { useState } from "react";

function Form(props: any) {
  const [disableForm, setDisableForm] = useState(false);
  const [input, setInput] = useState({
    name: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    subtasks: [],
    notes: "",
  });

  function handleSubmit(e) {
    if (!input.name) {
      alert("Please enter a task input.name");
      return;
    }
    e.preventDefault();
    props.addTask(
      input.name,
      input.deadline,
      input.priority,
      input.subtasks,
      input.notes
    );
    props.setForm(false);
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

  function handleCancel() {
    props.setForm(false);
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
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: string) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id: string, newName: string) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="name"
        className="input input__lg"
        autoComplete="off"
        placeholder="Type your task title here"
        disabled={disableForm}
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
            disabled={disableForm}
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
            disabled={disableForm}
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
            disabled={disableForm}
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
          onClick={handleCancel}
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

export default Form;

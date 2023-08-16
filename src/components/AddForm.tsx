import { useState } from "react";
import { nanoid } from "nanoid";
import { Subtask, Task } from "../appStore";
import { useViewService } from "../viewService";
import SmartInput from "./SmartInput";
import SubtaskContainer from "./SubtaskContainer";

export default function AddForm() {
  const { setDefaultView } = useViewService();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [addBtnDisabled, setAddBtnDisabled] = useState(false);

  const [input, setInput] = useState<Task>({
    id: `task-${nanoid()}`,
    createdDate: new Date().toISOString(),
    name: "",
    completed: false,
    completedDate: "",
    deadline: new Date().toISOString().substring(0, 10),
    priority: "",
    subtasks: subtasks,
    notes: "",
  });

  function handleChange(e: {
    target: { id: string; value: number | string | boolean };
  }) {
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
    const newTask: Task = {
      id: input.id,
      createdDate: input.createdDate,
      name: input.name,
      completed: false,
      completedDate: "",
      deadline: input.deadline,
      priority: input.priority,
      subtasks: subtasks,
      notes: input.notes,
    };

    window.api.addTask(newTask);
    setSubtasks([]);
    setDefaultView();
  }

  function handleCancel() {
    setDefaultView();
  }

  return (
    <form className="input-form">
      <p className="taskSize-hint">
        Remember: Try to make your tasks around <strong>30 minutes</strong> long. Otherwise,
        create subtasks manually or using the AI by clicking the <strong>check</strong>-button
      </p>
      <label htmlFor="title" className="label_title">
        title
      </label>
      <SmartInput
        smartInput={input.name}
        subtasks={subtasks}
        setSubtasks={setSubtasks}
        parentTaskId={input.id}
        handleChange={handleChange}
        setAddBtnDisabled={setAddBtnDisabled}
      />

      {/* subtask container with subtask items and input field to add new tasks*/}
      <div>
        <SubtaskContainer
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          parentTaskId={input.id}
        />
      </div>

      {/* input form containing settings for deadline and priority */}
      <div className="input-group">
        <label htmlFor="deadline" className="label_title">
          deadline
          <input
            type="date"
            id="deadline"
            className="input input__lg"
            value={input.deadline}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="priority" className="label_title">
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

      {/* input form for notes */}
      <div>
        <label htmlFor="notes" className="label_title">
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

      {/* buttons for adding tasks or cancelling */}
      <div className="btn-group">
        <button
          type="button"
          className="btn btn__danger"
          onClick={handleCancel}
        >
          cancel
        </button>
        <button disabled={addBtnDisabled} type="submit" className="btn" onClick={handleSubmit}>
          add
        </button>
      </div>
    </form>
  );
}

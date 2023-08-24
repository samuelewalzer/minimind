import { useState } from "react";
import { useViewService } from "../viewService";
import { nanoid } from "nanoid";

import SmartInput from "./SmartInput";
import SubtaskContainer from "./SubtaskContainer";
import ConfirmDialog from "./ConfirmDialog";

import { Subtask, Task } from "../appStore";

// Form for adding a new task
export default function AddForm() {
  const { setDefaultView, setDetailsView } = useViewService();
  const [addBtnDisabled, setAddBtnDisabled] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [input, setInput] = useState<Task>({
    id: `task-${nanoid()}`,
    createdDate: new Date().toISOString(),
    name: "",
    completed: false,
    completedDate: "",
    deadline: "",
    priority: "low",
    subtasks: subtasks,
    notes: "",
    checkCount: 0,
  });

  function handleChange(e: {
    target: { id: string; value: number | string | boolean };
  }) {
    setInput({
      ...input,
      [e.target.id]: e.target.value,
    });
  }

  // add task to the db
  function handleSubmit(e: { preventDefault: () => void }) {
    if (!input.name) {
      setConfirmation({
        title: "Task name missing!",
        message: "Please enter a task name!",
        showDialog: true,
        showConfirmButton: false,
      });
    } else {
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
        checkCount: checkCount,
      };

      window.api.addTask(newTask);
      setDetailsView(newTask);
    }
  }

  // Handlers for ConfirmDialog
  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
  });

  function handleCancel() {
    setDefaultView();
  }

  function handleDialogConfirm() {
    setConfirmation({
      ...confirmation,
      showDialog: false,
    });
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

      <form className="input-form">
        <p className="hint-tasksize">
          Goal: Provide a <strong>specific</strong> and{" "}
          <strong>measurable</strong> task of approximately{" "}
          <strong>30 minutes</strong> tasks. Be precise for better AI
          suggestions!
        </p>
      </form>
      <SmartInput
        smartInput={input.name}
        subtasks={subtasks}
        setCheckCount={setCheckCount}
        setSubtasks={setSubtasks}
        parentTaskId={input.id}
        handleChange={handleChange}
        setAddBtnDisabled={setAddBtnDisabled}
      />
      {/* subtask container with subtask items and input field to add new tasks*/}
      <div className="subtaskContainer">
        <SubtaskContainer
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          parentTaskId={input.id}
        />
      </div>

      {/* input form containing settings for deadline and priority */}
      <form>
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
          <button type="button" className="btn danger" onClick={handleCancel}>
            cancel
          </button>
          <button
            disabled={addBtnDisabled}
            type="submit"
            className="btn add"
            onClick={handleSubmit}
          >
            add
          </button>
        </div>
      </form>
    </>
  );
}

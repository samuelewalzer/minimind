import { useState } from "react";
import { nanoid } from "nanoid";
import { Subtask, Task } from "../appStore";
import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";
import SmartInput from "./SmartInput";
import SubtaskContainer from "./SubtaskContainer";
import ConfirmDialog from "./ConfirmDialog";

export default function AddForm() {
  const { setDefaultView } = useViewService();
  const { triggerRerender } = useGlobalRerender();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [addBtnDisabled, setAddBtnDisabled] = useState(false);

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
  });

  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
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
      setConfirmation({
        title: "Task name missing!",
        message: "Please enter a task name!",
        showDialog: true,
        showConfirmButton: false,
      });
    } else {
      console.log("Im inside the else");
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
      triggerRerender();
      setSubtasks([]);
      setDefaultView();
    }
  }

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
      Remember: <strong>30 minutes</strong> tasks and be precise, quantify
      tasks. The AI assists you.
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
      </form>
      <div>
        <SubtaskContainer
          subtasks={subtasks}
          setSubtasks={setSubtasks}
          parentTaskId={input.id}
        />
      </div>
      <form>
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

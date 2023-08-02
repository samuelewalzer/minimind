import { useViewService } from "../viewService";
import { Task } from "../appStore";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  function toggleTaskCompleted() {
    const toggledTask: Task = {
      id: props.currentTask.id,
      completed: !props.currentTask.completed,
      name: props.currentTask.name,
      deadline: new Date(props.currentTask.deadline),
      priority: props.currentTask.priority,
      subtasks: props.currentTask.subtasks,
      notes: props.currentTask.notes,
    };
    window.api.editTask(toggledTask);
  }

  const date = new Date(props.currentTask.deadline);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <div className="stack-small">
      <div className="c-cb" onClick={() => setDetailsView(props.currentTask)}>
        <input
          id={props.currentTask.id}
          type="checkbox"
          defaultChecked={props.currentTask.completed}
          onClick={toggleTaskCompleted}
        />

          <label className="" htmlFor={props.currentTask.id}>
            <span>{props.currentTask.name}</span>
          </label>
          <label
            className="todo-label"
            htmlFor={props.currentTask.deadline}
          >
            <span>{formattedDate}</span>
          </label>

      </div>
    </div>
  );
}

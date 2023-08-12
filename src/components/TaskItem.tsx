import { useViewService } from "../viewService";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  function handleClick(e) {
    e.stopPropagation();
    setDetailsView(props.currentTask);
  }

  function toggleTaskCompletion(e) {
    e.stopPropagation();
    window.api.toggleTaskCompletion(props.currentTask.id, props.currentTask.completed);
  }

  const date = new Date(props.currentTask.deadline);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <div className="stack-small" onClick={handleClick}>
      <div className="c-cb left-section">
        <input
          id={props.currentTask.id}
          type="checkbox"
          defaultChecked={props.currentTask.completed}
          onClick={toggleTaskCompletion}
        />
        <label className="todo-label">
          {props.currentTask.name}
        </label>
        <label className="todo-label">
          {props.currentTask.deadline === null || props.currentTask.deadline === "" ? "" : formattedDate}
        </label>
      </div>
      <div></div>
    </div>
  );
}

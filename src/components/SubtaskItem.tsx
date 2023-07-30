import { useViewService } from "../viewService";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  function toggleTaskCompleted() {
    const toggledTask = {
      id: props.currentTask.id,
      completed: !props.currentTask.completed,
      name: props.currentTask.name,
      deadline: new Date(props.currentTask.deadline),
      priority: props.currentTask.priority,
      subtasks: props.currentTask.subtasks,
      notes: props.currentTask.notes,
    };
    window.api.editTask(toggledTask)
  }

  return (
    <div className="stack-small">
      <div className="c-cb" onClick={() => setDetailsView(props.currentTask)}>
        <input
          id={props.currentTask.id}
          type="checkbox"
          defaultChecked={props.currentTask.completed}
          onClick={toggleTaskCompleted}
        />
        <label 
          className="todo-label" 
          htmlFor={props.currentTask.id} >
            <span>{props.currentTask.name}</span>
        </label>
      </div>
    </div>
  );
}

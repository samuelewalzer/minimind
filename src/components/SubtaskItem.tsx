import { Subtask } from "src/appStore";
import { useViewService } from "../viewService";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  function toggleTaskCompleted() {
    const toggledTask: Subtask = {
      id: props.currentTask.id,
      completed: !props.currentTask.completed,
      name: props.currentTask.name,
      pentTask: props.currentTask.parentTask,
    };
    window.api.editSubtask(toggledTask)
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

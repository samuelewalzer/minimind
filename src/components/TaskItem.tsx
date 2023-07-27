import { useViewService } from "../viewService";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  return (
    <div className="stack-small">
      <div className="c-cb" onClick={() => setDetailsView()}>
        <input
          id={props.id}
          type="checkbox"
          defaultChecked={props.completed}
          onClick={() => props.toggleTaskCompleted(props.id)}
        />
        <label 
          className="todo-label" 
          htmlFor={props.id} >
            <span onClick={() => setDetailsView()}>{props.name}</span>
        </label>
      </div>
    </div>
  );
}

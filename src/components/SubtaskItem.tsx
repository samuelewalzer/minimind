import { Subtask } from "src/appStore";
import { useViewService } from "../viewService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function SubTaskItem(props) {
  const { setDetailsView, viewMode } = useViewService();

  function toggleTaskCompleted() {
    const toggledTask: Subtask = {
      id: props.currentTask.id,
      completed: !props.currentTask.completed,
      name: props.currentTask.name,
      pentTask: props.currentTask.parentTask,
    };
    window.api.editSubtask(toggledTask);
  }

  //When in details mode, display the subtask items with a checkbox
  const detailsTemplate = (
    <div className="c-cb" onClick={() => setDetailsView(props.currentTask)}>
      <input
        id={props.subtask.id}
        type="checkbox"
        defaultChecked={props.subtask.completed}
        onClick={toggleTaskCompleted}
      />
      <label className="todo-label" htmlFor={props.subtask.id}>
        <span>{props.subtask.name}</span>
      </label>
    </div>
  );

  // When in edit or add mode, display an input field that can be edited
  const editAddTemplate = (
    <>
      <div className="input-container">
        <input
          type="text"
          id="subtask"
          className="input input__lg"
          autoComplete="off"
          placeholder={props.subtask.name}
          // value={props.subtask.name}
          // onChange={props.handleChange}
        />
        <button type="button" className="btn">
        <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff2600",}} />
        </button>
      </div>
    </>
  );

  return (
    <div className="stack-small">
      {viewMode === "details"
        ? detailsTemplate
        : viewMode === "edit" || viewMode === "add"
        ? editAddTemplate
        : null}
    </div>
  );
}

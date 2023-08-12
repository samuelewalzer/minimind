import { useViewService } from "../viewService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function SubTaskItem(props) {
  const { viewMode } = useViewService();
  const [subtaskName, setSubtaskName] = useState(props.subtask.name || "");

  function handleChange(e) {
    setSubtaskName(e.target.value);
  }

  function toggleSubtaskCompletion() {
    window.api.toggleSubtaskCompletion(props.subtask.id, props.subtask.completed);
  }

  //When in details mode, display the subtask items with a checkbox
  const detailsTemplate = (
    <div className="c-cb subtask-item">
      <input
        id={props.subtask.id}
        type="checkbox"
        defaultChecked={props.subtask.completed}
        onClick={toggleSubtaskCompletion}
      />
      <label className="todo-label">
        {props.subtask.name}
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
          placeholder={subtaskName}
          value={subtaskName}
          onChange={handleChange}
          onBlur={() => props.editSubtask(props.subtask.id, subtaskName)}
        />
        <button
          type="button"
          className="btn"
          onClick={() => props.deleteSubtask(props.subtask.id)}
        >
          {/* TODO: Add edit button and delete onBlur handler */}
          <FontAwesomeIcon icon={faTrashCan} style={{ color: "#ff2600" }} />
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


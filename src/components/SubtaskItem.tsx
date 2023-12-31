import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Subtask } from "../appStore";

export default function SubTaskItem(props: {
  subtask: Subtask;
  editSubtask: (subtaskId: string, newName: string) => void;
  deleteSubtask: (subtaskId: string) => void;
}) {
  const { viewMode } = useViewService();
  const { toggleRerender } = useGlobalRerender();
  const [subtaskName, setSubtaskName] = useState(props.subtask.name || "");

  function handleChange(e: { target: { value: string } }) {
    setSubtaskName(e.target.value);
  }

  function handleEdit() {
    props.editSubtask(props.subtask.id, subtaskName);
  }

  function toggleSubtaskCompletion() {
    window.api.toggleSubtaskCompletion(props.subtask.id);
    toggleRerender();
  }

  function handleDelete() {
    props.deleteSubtask(props.subtask.id);
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
      <label className="task-label">{props.subtask.name}</label>
    </div>
  );

  // When in edit or add mode, display an input field that can be edited
  const editAddTemplate = (
    <>
      <div className="input-container">
        <input
          type="text"
          id="subtask"
          className="input input__lg input__subtask"
          autoComplete="off"
          placeholder={subtaskName}
          value={subtaskName}
          onChange={handleChange}
          onBlur={handleEdit}
        />
        <button type="button" className="btn faTrashCan" onClick={handleDelete}>
          <FontAwesomeIcon icon={faTrashCan} className="faTrashCan" />
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

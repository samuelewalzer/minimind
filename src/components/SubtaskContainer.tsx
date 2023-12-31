import { nanoid } from "nanoid";
import { SetStateAction, useState } from "react";
import SubtaskItem from "./SubtaskItem";
import { useViewService } from "../viewService";
import { Subtask } from "../appStore";
import ConfirmDialog from "./ConfirmDialog";

// This component receives a list of subtasks with properties id, name, completed and parentId
// handles their view:
// add & edit: enabled input fields with delete function
// details: task

export default function SubtaskContainer(props: {
  subtasks: Subtask[];
  setSubtasks: (arg0: Subtask[]) => void;
  parentTaskId: string;
}) {
  const { viewMode } = useViewService();
  const [subtaskName, setSubtaskName] = useState("");
  const [confirmation, setConfirmation] = useState({
    title: "Test",
    message: "",
    showDialog: false,
    showConfirmButton: true,
  });

  const subtaskList = props.subtasks
    .filter((subtask) => !subtask.deleted && subtask.name)
    .map((subtask) => (
      <SubtaskItem
        key={subtask.id}
        subtask={subtask}
        editSubtask={editSubtask}
        deleteSubtask={deleteSubtask}
      />
    ));

  function handleChange(e: { target: { value: SetStateAction<string> } }) {
    setSubtaskName(e.target.value);
  }
  // When adds the subtask, the subtask list in the form gets updated where it is then saved to the db
  function addSubtask(e: {
    stopPropagation: () => void;
    preventDefault: () => void;
  }) {
    if (!subtaskName) {
      // alert("Please enter a subtask name");
      setConfirmation({
        title: "No subtask name!",
        message: "Please enter a subtask name",
        showDialog: true,
        showConfirmButton: false,
      });
    }
    e.preventDefault();
    e.stopPropagation();
    const newSubtask: Subtask = {
      id: `subtask-${nanoid()}`,
      name: subtaskName,
      createdDate: new Date().toISOString(),
      completed: false,
      completedDate: "",
      parentTaskId: props.parentTaskId,
      deleted: false,
    };
    props.setSubtasks([...props.subtasks, newSubtask]);
    setSubtaskName("");
  }

  function deleteSubtask(subtaskId: string) {
    const updatedSubtasks = props.subtasks.map((subtask: Subtask) =>
      subtask.id === subtaskId ? { ...subtask, deleted: true } : subtask
    );
    console.log("subtaskcontainer; ", updatedSubtasks);
    props.setSubtasks(updatedSubtasks);
  }

  function editSubtask(subtaskId: string, newName: string) {
    const updatedSubtasks = props.subtasks.map((subtask: Subtask) =>
      subtask.id === subtaskId ? { ...subtask, name: newName } : subtask
    );
    props.setSubtasks(updatedSubtasks);
  }

  const editAddTemplate = (
    <>
      <form className="input-container" onSubmit={addSubtask}>
        <input
          type="text"
          id="subtask"
          placeholder="add subtask"
          className="input input__lg"
          value={subtaskName}
          onChange={handleChange}
          onSubmit={addSubtask}
        />
        <button className="btn small" onClick={addSubtask}>
          add
        </button>
      </form>
    </>
  );

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
      <label htmlFor="subtasks" className="label_title">
        subtasks
      </label>
      <div
        className={`subtaskList ${viewMode === "details" ? "details" : "add"}`}
      >
        {subtaskList.length > 0 ? subtaskList : <p>No subtasks added</p>}
      </div>
      <div>
        {viewMode === "add" || viewMode === "edit" ? editAddTemplate : null}
      </div>
    </>
  );
}

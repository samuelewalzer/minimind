import { nanoid } from "nanoid";
import { useState } from "react";
import SubtaskItem from "./SubtaskItem";
import { useViewService } from "../viewService";
import { Subtask } from "src/appStore";

// This component receives a list of subtasks with properties id, name, completed and parentId
// handles their view: 
  // add & edit: enabled input fields with delete function
  // details: task

export default function SubtaskContainer(props) {
  const { viewMode } = useViewService();
  const [subtaskName, setSubtaskName] = useState("");

  const subtaskList = props.subtasks.filter((subtask) => !subtask.deleted && subtask.name).map((subtask) => (
    <SubtaskItem
      key={subtask.id}
      subtask={subtask}
      handleChange={handleChange}
      editSubtask={editSubtask}
      deleteSubtask={deleteSubtask}
    />
  ));

  function handleChange(e) {
    setSubtaskName(e.target.value);
  }
  // When adds the subtask, the subtask list in the form gets updated where it is then saved to the db
  function addSubtask(e) {
    if (!subtaskName) {
      alert("Please enter a subtask name");
      return;
    }
    e.preventDefault();
    const newSubtask: Subtask = {
      id: `subtask-${nanoid()}`,
      createdDate: new Date(),
      completed: 0,
      name: subtaskName,
    };
    props.setSubtasks([...props.subtasks, newSubtask]);
    setSubtaskName("");
  }

  function deleteSubtask(subtaskId: string) {
    const updatedSubtasks = props.subtasks.map((subtask) => 
      subtask.id === subtaskId ? {...subtask, deleted: true} : subtask
    );
    props.setSubtasks(updatedSubtasks);
  }

  function editSubtask(subtaskId: string, newName: string) {
    const updatedSubtasks = props.subtasks.map((subtask) => 
      subtask.id === subtaskId ? {...subtask, name: newName} : subtask
    );
    props.setSubtasks(updatedSubtasks);
  }

  const editAddTemplate = (
    <>
      <div className="input-container">
        <input
          type="text"
          id="subtask"
          placeholder="add subtask"
          className="input input__lg"
          value={subtaskName}
          onChange={handleChange}
        />
        <button type="button" className="btn" onClick={addSubtask}>
          add
        </button>
      </div>
    </>
  );

  return (
    <>
    <label htmlFor="subtasks" className="label_title">
        subtasks
      </label>
      <div className="subtask-container">
      {subtaskList.length > 0 ? subtaskList : <p>No subtasks added</p>}
    </div>
      <div>
        {viewMode === "add" || viewMode === "edit" ? editAddTemplate : null}
      </div>
    </>
  );
}


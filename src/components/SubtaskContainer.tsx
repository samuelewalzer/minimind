import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import SubtaskItem from "./SubtaskItem";
import { useViewService } from "../viewService";

// This component receives a list of subtasks with properties id, name, completed and parentId
// handles their view: 
  // add & edit: enabled input fields with delete function
  // details: task

export default function SubtaskContainer(props) {
  const { viewMode } = useViewService();
  // const [subtasks, setSubtasks] = useState(props.subtasks);
  const [subtaskName, setSubtaskName] = useState("");

  // useEffect(() => {
  //     setSubtasks(props.subtasks);
  // }, [props.subtasks]);

  const subtaskList = props.subtasks.map((subtask) => (
    <SubtaskItem
      key={subtask.id}
      subtask={subtask}
      handleChange={handleChange}
      delete={deleteSubtask}
    />
  ));

  function handleChange(e) {
    setSubtaskName(e.target.value);
  }
  // When the user submits the form, add the subtask to the database
  function addSubtask(e) {
    if (!subtaskName) {
      alert("Please enter a subtask name");
      return;
    }
    e.preventDefault();
    const newSubtask = {
      id: `subtask-${nanoid()}`,
      completed: false,
      name: subtaskName,
      parentTaskId: props.parentTaskId,
    };
    props.setSubtasks([...props.subtasks, newSubtask]);
    setSubtaskName("");
  }

  function deleteSubtask(subtaskId: String) {
    const updatedSubtasks = props.subtasks.filter((subtask) => subtask.id !== subtaskId);
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
      <label htmlFor="subtasks" className="label_details">
        subtasks
      </label>
      {subtaskList.length > 0 ? subtaskList : <p>No subtasks added</p>}
      <div>
        {viewMode === "add" || viewMode === "edit" ? editAddTemplate : null}
      </div>
    </>
  );
}

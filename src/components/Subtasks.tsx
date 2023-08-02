import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import SubtaskItem from "./SubtaskItem";
import { useViewService } from "../viewService";

export default function Subtasks(props) {
  const { viewMode } = useViewService();
  const [subtasks, setSubtasks] = useState([]);
  const [inputField, setInputField] = useState(false);
  const [subtaskInput, setSubtaskInput] = useState({
    name: "",
    completed: false,
  });

  // Fetch subtask from databse through main process
  useEffect(() => {
    async function fetchSubtasks() {
      try {
        const subtasksFromDB = await window.api.getSubtasksFromParent(
          props.parentTaskId
        );
        setSubtasks(subtasksFromDB);
      } catch (error) {
        console.log("Error fetching subtasks:", error);
      }
    }
    fetchSubtasks();
  }, [props.parentTaskId, subtasks]);

  const subtaskList = subtasks.map((subtask) => (
    <SubtaskItem
      key={subtask.id}
      subtask={subtask}
      handleChange={handleChange}
    />
  ));

  function handleChange(e) {
    setSubtaskInput({
      ...subtaskInput,
      name: e.target.value,
    });
  }

  // When the user submits the form, add the subtask to the database
  function addSubtask(e) {
    if (!subtaskInput.name) {
      alert("Please enter a subtask name");
      return;
    }
    e.preventDefault();
    const newSubtask = {
      id: `subtask-${nanoid()}`,
      completed: false,
      name: subtaskInput.name,
      parentTaskId: props.parentTaskId,
    };
    setSubtasks([...subtasks, newSubtask]);
    console.log(subtasks)
    setSubtaskInput({
      name: "",
      completed: false,
    });
  }

  const editAddTemplate = (
    <>
      <div className="input-container">
        <input
          type="text"
          id="subtask"
          placeholder="add subtask"
          className="input input__lg"
          value={subtaskInput.name}
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

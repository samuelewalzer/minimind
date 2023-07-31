import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { Subtask } from "../appStore";
import SubtaskItem from "./SubtaskItem";

export default function Subtasks(props) {
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
        const subtasksFromDB = await window.api.getSubtasksFromParent(props.parentTaskId);
        setSubtasks(subtasksFromDB);
        console.log(`Subtasks of ${props.parentTaskId}from DB:`, subtasksFromDB);
      } catch (error) {
        console.log("Error fetching subtasks:", error);
      }
    }
    fetchSubtasks();
    console.log("Subtasks:", subtasks);
  }, [props.parentTaskId, subtasks]);

  const subtaskList = subtasks ? (subtasks.map((subtask: Subtask) => (
    <SubtaskItem key={subtask.id} subtask={subtask} />
  ))) : (
    <p>No subtasks available</p>
  );

  function handleChange(e) {
    setSubtaskInput({
      ...subtaskInput,
      name: e.target.value,
    });
  }

  // When the user submits the form, add the subtask to the database
  function handleSubmit(e) {
    if (!subtaskInput.name) {
      alert("Please enter a subtask name");
      return;
    }
    e.preventDefault();
    const newSubtask: Subtask = {
      id: `subtask-${nanoid()}`,
      completed: false,
      name: subtaskInput.name,
      parentTaskId: props.parentTaskId,
    };
    window.api.addSubtask(newSubtask);
    setInputField(false);
  }

  const addButton = (
    <button type="button" className="btn" onClick={() => setInputField(true)}>
      add subtask
    </button>
  );

  const inputFieldTemplate = (
    <>
      <input
        type="text"
        id="subtask"
        placeholder="set the title of the subtask"
        className="input input__lg"
        onChange={handleChange}
      />
      <button
        type="button"
        className="btn"
        style={{ marginRight: "1rem" }}
        onClick={() => setInputField(false)}
      >
        cancel
      </button>
      <button type="button" className="btn" onClick={handleSubmit}>
        submit
      </button>
    </>
  );
  return (
    <>
      <label htmlFor="subtasks">subtasks</label>
      {subtaskList}
      <div>{inputField ? inputFieldTemplate : addButton}</div>
    </>
  );
}
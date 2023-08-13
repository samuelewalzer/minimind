import { faBarsStaggered, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { useViewService } from "../viewService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function TaskItem(props) {
  const { setDetailsView } = useViewService();

  function handleClick(e) {
    e.stopPropagation();
    setDetailsView(props.currentTask);
  }

  function toggleTaskCompletion(e) {
    e.stopPropagation();
    window.api.toggleTaskCompletion(
      props.currentTask.id,
      props.currentTask.completed
    );
  }

  const [hasSubtasks, setHasSubtasks] = useState(false);
  useEffect(() => {
    async function checkSubtasks() {
      try {
        const response = await window.api.taskHasSubtasks(props.currentTask.id);
        setHasSubtasks(response);
      } catch (error) {
        console.error("Error checking subtasks");
      }
    }

    checkSubtasks();
  });

  const date = new Date(props.currentTask.deadline);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${day}.${month}.${year}`;

  return (
    <div className="stack-small" onClick={handleClick}>
      <div className="c-cb" style={{paddingLeft: hasSubtasks ? "10px" : "40px", opacity: props.currentTask.completed ? 0.3 : 1}}>
        {hasSubtasks ? (
          <FontAwesomeIcon
            icon={faBarsStaggered}
            style={{ paddingLeft: "0px", paddingRight: "13px" }}
          />
        ) : (
          <input
            id={props.currentTask.id}
            type="checkbox"
            disabled={props.currentTask.completed && hasSubtasks ? true : false}
            defaultChecked={props.currentTask.completed}
            onClick={toggleTaskCompletion}
          />
        )}
        <label className="todo-label">{props.currentTask.name}</label>
        <label className="todo-label">
          {props.currentTask.deadline === null ||
          props.currentTask.deadline === ""
            ? ""
            : formattedDate}
        </label>
      </div>
    </div>
  );
}

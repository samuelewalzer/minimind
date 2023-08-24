import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSProperties, useEffect, useState } from "react";
import { Task } from "../appStore";

export default function TaskItem(props: { currentTask: Task }) {
  const { setDetailsView, currentTask, viewMode } = useViewService();
  const { toggleRerender } = useGlobalRerender();
  const date = new Date(props.currentTask.deadline);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const formattedDate = `${day}.${month}.${year}`;

  // date comparison to check wheter task is overdue
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const isOverdue = new Date(props.currentTask.deadline) < currentDate;

  function handleClick(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    setDetailsView(props.currentTask);
  }

  function toggleTaskCompletion(e: { stopPropagation: () => void }) {
    e.stopPropagation();
    window.api.toggleTaskCompletion(
      props.currentTask.id,
      props.currentTask.completed
    );
    toggleRerender();
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

  // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
  const completedTaskStyling: CSSProperties = {
    paddingLeft: hasSubtasks ? "12px" : "40px",
    opacity: props.currentTask.completed ? 0.3 : 1,
  };

  const getPriorityIndicator = () => {
    switch (props.currentTask.priority) {
      case "high":
        return <span className="prio-indicator high">!!!</span>;
      case "middle":
        return <span className="prio-indicator middle">!!</span>;
      case "low":
        return <span className="prio-indicator low">!</span>;
      default:
        return null;
    }
  };

  return (
    <div className="stack-small" onClick={handleClick}>
      <div
        className={`c-cb ${
          props.currentTask.id === currentTask.id && viewMode !== "default"
            ? "selected"
            : ""
        } ${hasSubtasks && "has-subtasks"}`}
        style={completedTaskStyling}
      >
        {hasSubtasks ? (
          <FontAwesomeIcon
            icon={faFolderOpen}
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            style={{ paddingLeft: "0px", paddingRight: "10px" }}
          />
        ) : (
          <input
            id={props.currentTask.id}
            type="checkbox"
            disabled={!!(props.currentTask.completed && hasSubtasks)}
            defaultChecked={props.currentTask.completed}
            onClick={toggleTaskCompletion}
          />
        )}

        <label className="task-label">{props.currentTask.name}</label>
        {getPriorityIndicator()}
        <label className={`${isOverdue ? "task-overdue" : ""}`}>
          {props.currentTask.deadline === null ||
          props.currentTask.deadline === ""
            ? ""
            : formattedDate}
        </label>
      </div>
    </div>
  );
}

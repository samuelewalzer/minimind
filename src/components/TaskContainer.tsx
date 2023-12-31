import React, { useEffect, useState } from "react";
import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";

import FilterButton from "./FilterButton";
import TaskItem from "./TaskItem";
import { Task } from "../appStore";

const FILTER_MAP = {
  all: () => true,
  active: (task: Task) => !task.completed,
  completed: (task: Task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskContainer() {
  console.log("TaskContainer rendered");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("active");
  const { setAddView, viewMode } = useViewService();
  const { rerenderToggle } = useGlobalRerender();

  // Fetch tasks from database through api
  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasksFromDB = await window.api.getTasks();
        setTasks(tasksFromDB);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    }

    fetchTasks();
    console.log("Fetching tasks from database");
  }, [rerenderToggle, viewMode]);

  const taskList = tasks
    .filter(
      (task) =>
        FILTER_MAP[filter as keyof typeof FILTER_MAP](task) && !task.deleted
    )
    .map((task) => <TaskItem currentTask={task} key={task.id} />);
  console.log(tasks.forEach((task) => console.log(task.completed)));
  console.log(
    taskList.forEach((task) => console.log(task.props.currentTask.completed))
  );

  const filterList = FILTER_NAMES.map((name, index) => (
    <React.Fragment key={index}>
      <FilterButton
        name={name}
        isPressed={name === filter}
        setFilter={setFilter}
      />
      {index !== FILTER_NAMES.length - 1 && <span>|</span>}
    </React.Fragment>
  ));

  function handleAdd() {
    setAddView();
  }

  return (
    <>
      <div className="taskContainer">
        <h2>all tasks</h2>
        <>
          <div className="">
            <strong>filter: </strong>
            {filterList}
          </div>
          <ul role="list" className="stack-large taskList">
            {taskList.length ? (
              taskList
            ) : (
              <h3>click on the button below to add a tasks</h3>
            )}
          </ul>
          <button
            type="button"
            className="btn btn__primary btn__lg"
            onClick={handleAdd}
          >
            add task
          </button>
        </>
      </div>
    </>
  );
}

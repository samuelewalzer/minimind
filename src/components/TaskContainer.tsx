import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import TaskItem from "./TaskItem";
import { useViewService } from "../viewService";
import { useGlobalRerender } from "../globalRendererContext";
import { Task } from "../appStore"

const FILTER_MAP = {
  All: () => true,
  Active: (task: Task) => !task.completed,
  Completed: (task: Task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskContainer() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("Active");
  const { setAddView } = useViewService();
  const {rerenderToken } = useGlobalRerender();

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
  }, [rerenderToken]);

  const taskList = tasks
    .filter((task) => FILTER_MAP[filter as keyof typeof FILTER_MAP](task))
    .map((task) => (
      <TaskItem
        currentTask = {task}
        key={task.id}
      />
    ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function handleAdd() {
    setAddView();
  }

  return (
    <>
      <div className="taskContainer">
      <h2>all Tasks</h2>
        <>
          <div className="filters btn-group">{filterList}</div>
          <ul
            role="list"
            className="stack-large taskList"
          >
            {taskList.length ? taskList: <h3>click on the button below to add a tasks</h3>}
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


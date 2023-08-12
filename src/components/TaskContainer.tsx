import { useEffect, useState } from "react";
import FilterButton from "./FilterButton";
import TaskItem from "./TaskItem";
import { useViewService } from "../viewService";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskContainer(props) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const { setAddView } = useViewService();

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
  }, [tasks]);

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <TaskItem
        currentTask = {task}
        key={task.id}
        currentTaskId={props.currentTaskId}
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

  return (
    <>
      <div className="task-container">
        <>
          <div className="filters btn-group stack-exception">{filterList}</div>
          <ul
            role="list"
            className="todo-list stack-large stack-exception"
            aria-labelledby="list-heading"
          >
            {taskList}
          </ul>
          <button
            type="button"
            className="btn btn__primary btn__lg"
            onClick={() => setAddView()}
          >
            add task
          </button>
        </>
      </div>
    </>
  );
}


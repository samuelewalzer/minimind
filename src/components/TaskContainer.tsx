import React, { useState } from "react";
import Form from "./Form";
import FilterButton from "./FilterButton";
import TaskItem from "./TaskItem";
import { nanoid } from "nanoid";

const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskContainer(props) {

    const [tasks, setTasks] = useState(props.tasks);
    const [filter, setFilter] = useState("All");
    const [form, setForm] = useState(false);

    const taskList = tasks
        .filter(FILTER_MAP[filter])
        .map((task) => (
        <TaskItem 
            id={task.id} 
            name={task.name} 
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            showDetails={() => props.showDetails(task)}
            deleteTask={deleteTask}
            editTask={editTask}
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

    function toggleTaskCompleted(id: string) {
        const updatedTasks = tasks.map((task) => {
            if (id === task.id) {
                return {...task, completed: !task.completed};
            } return task;
        });
        setTasks(updatedTasks);
    }

    function addTask(name: string, deadline: string, priority: string, subtasks: string[], notes: string) {
        const newTask = {id: `task-${nanoid()}`, name, completed: false, deadline, priority, subtasks, notes};
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: string) {
        const remainingTasks = tasks.filter((task) => id !== task.id);
        setTasks(remainingTasks);
    }

    function editTask(id: string, newName: string) {
        const editedTaskList = tasks.map((task) => {
            if (id === task.id) {
                return {...task, name: newName};
            } return task;
        });
        setTasks(editedTaskList);
    }

    const addView = (
        <><Form addTask={addTask} setForm={setForm}/>
        </>
    );

    const tasksView = (
        <><div className="filters btn-group stack-exception">
            {filterList}
        </div><ul
            role="list"
            className="todo-list stack-large stack-exception"
            aria-labelledby="list-heading">
                {taskList}
            </ul><button
                type="button"
                className="btn btn__primary btn__lg"
                onClick={() => setForm(true)}>
                Add task
            </button></>
    );

    console.log(tasks);

    return (
        <>
        <h2 style={{ textAlign: "center", padding: "2rem"}}>All Tasks</h2>
        <div className="task-container">
            {form ? addView : tasksView}
        </div>
        </>
    )
}
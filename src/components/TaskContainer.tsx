import React, { useState } from "react";
import Form from "./Form";
import FilterButton from "./FilterButton";
import TaskItem from "./TaskItem";

const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function TaskContainer(props) {

    const [filter, setFilter] = useState("All");

    const taskList = props.tasks
        .filter(FILTER_MAP[filter])
        .map((task) => (
        <TaskItem
            id={task.id} 
            name={task.name} 
            completed={task.completed}
            key={task.id}
            toggleTaskCompleted={toggleTaskCompleted}
            showDetails={props.showDetails}
            setEditing={props.setEditing}
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
        const updatedTasks = props.tasks.map((task) => {
            if (id === task.id) {
                return {...task, completed: !task.completed};
            } return task;
        });
        props.setTasks(updatedTasks);
    }

    function handleClick () {
        props.setFormVis(true);
        props.setEditing(true);
    }   

    return (
        <>
        <h2 style={{ textAlign: "center", padding: "2rem"}}>All Tasks</h2>
        <div className="task-container">
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
                onClick={handleClick}>
                Add task
            </button></>
        </div>
        </>
    )
}
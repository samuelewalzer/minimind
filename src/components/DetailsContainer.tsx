import React, { useState } from "react";
import Form from "./Form";

export default function DetailsContainer(props) {
  const [editTask, setEditTask] = useState(false);

  const detailView = (
    <>
      <h1>{props.task.id}</h1>
      <h2>{props.task.name}</h2>
      <button
        type="button"
        className="btn btn__primary btn__lg"
        onClick={() => setEditTask(true)}
      >
        Edit task
      </button>
    </>
  );

  const editView = (
    <>
      <h1>Edit task</h1>
      <Form />
    </>
  );

  return editTask ? editView : detailView;
}

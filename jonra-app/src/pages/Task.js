import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./task-style.css";

// props are: name, description, priority, status

export const Task = props => {
    const { name } = useParams();
    const { boardId, taskName, description, priority, status } = props;

    return (
        <div className="taskContainer">
            <h2 className="taskTitle">{taskName}</h2>
            <hr />
            <p>Description: {description ? description : "None"}</p>
            <p>Priority: {priority}</p>
            <p>Status: {status}</p>
            {props.children}
        </div>
    );
}

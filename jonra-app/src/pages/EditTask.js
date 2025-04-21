import React, { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { editTask, getTaskFromName, getTaskFromId } from "../api/tasks";
import "./task-style.css";
import "./login-page-style.css"

// props are: name, description, priority, status

export const EditTask = props => {
    const { name, boardId, taskId } = useParams();
    const { taskName, description, priority, status } = props;
    const [ editName, setEditName ] = useState(taskName);
    const [ editDesc, setEditDesc ] = useState(description);
    const [ editPriority, setEditPriority ] = useState(priority);
    const [ editStatus, setEditStatus ] = useState(status);

    const handleEdit = async () => {
        // const res = await editTask(name, boardId, taskId, editName, editDesc, editPriority, editStatus);
        window.location.replace(`http://localhost:5000/home/${name}/board/${boardId}`);
    }

    // const getTaskInfo = async () => {
    //     const res = await getTaskFromId(name, boardId, taskId);
    //     setAttributes([res.fields.name, res.fields.description, res.fields.priority, res.fields.status]);
    // }

    // useEffect(() => {
    //     getTaskInfo();
    // }, [])

    return (
        <div className="taskContainer">
                <h2 className="taskTitle">
                    <input 
                        id="taskHeaderTitle"
                        className="login-input"
                        type="text"
                        placeholder={taskName} 
                        maxLength={250} 
                        onChange={() => setEditName(document.getElementById("taskHeaderTitle").value)}
                        required
                    />
                </h2>

                <hr />

                <p>
                    <input 
                        id="taskPdesc"
                        className="login-input"
                        type="text"
                        placeholder={description} 
                        onChange={() => setEditDesc(document.getElementById("taskPdesc").value)}
                        maxLength={2500}
                    />
                </p>

                <p>
                    <input 
                        id="taskPpriority"
                        className="login-input"
                        type="text"
                        placeholder={priority}
                        onChange={() => setEditPriority(document.getElementById("taskPpriority").value)}
                    />
                </p>

                <p>
                    <input 
                        id="taskPstatus"
                        className="login-input"
                        type="text"
                        placeholder={status}
                        onChange={() => setEditStatus(document.getElementById("taskPstatus").value)}
                    />
                </p>
                <button id="save-edit" className="login-button" onClick={handleEdit}>Save</button>
                {/* {props.children} */}
            </div>
    );
}

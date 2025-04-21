import React, { useEffect, useState } from "react";
import { useFetcher, useParams } from "react-router-dom";
import { editTask, getTaskFromId } from "../api/tasks";
import "./task-style.css";
import "./login-page-style.css"

// props are: name, description, priority, status

export const Task = props => {
    const { name } = useParams();
    const { boardId, taskId, taskName, description, priority, status, handleGetTasks } = props;
    const [ editName, setEditName ] = useState(taskName);
    const [ editDesc, setEditDesc ] = useState(description);
    const [ editPriority, setEditPriority ] = useState(priority);
    const [ editStatus, setEditStatus ] = useState(status);
    const [ edit, setEdit ] = useState(false);
    const [ attributes, setAttributes ] = useState([taskName, description, priority, status]);

    const getTaskInfo = async () => {
        const res = await getTaskFromId(name, boardId, taskId);
        setAttributes([res.fields.name, res.fields.description, res.fields.priority, res.fields.status]);
    }

    const handleEdit = async () => {
        await editTask(name, boardId, taskId, editName, editDesc, editPriority, editStatus);
        setEdit(false);
        getTaskInfo();
    }

    useEffect(() => {
        handleGetTasks();
    }, [attributes])

    return (
        <div className="taskContainer">
            {!edit &&
                <div>
                    <h2 className="taskTitle">{taskName}</h2>
                    <hr />
                    <p>Description: {description}</p>
                    <p>Priority: {priority}</p>
                    <p>Status: {status}</p>
                    
                    <div className="taskButtonContainer">
                        <button id="edit-button" className="login-button" onClick={() => setEdit(true)}>Edit</button>
                        {props.children}
                    </div>
                </div>
            }
            {edit && 
                <div>
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
                <button id="save" className="login-button" onClick={handleEdit}>Save</button>
                </div>
            }
        </div>
    );
}

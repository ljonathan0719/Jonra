import { useParams } from "react-router-dom";
import { getTasks, removeTask, createTask, editTask } from "../api/tasks"
import { useEffect, useState } from "react";
import { authLogout } from "../api/auth";
import { Task } from "./Task.js";
import { Link } from "react-router-dom";
import "./login-page-style.css"
import "./task-style.css";
import "./form.css"


const Board = () => {

    const { name, id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [taskParams, setTaskParams] = useState(["Task", "None", "M", "NS"]);
    const [errorMsg, setErrorMsg] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleGetTasks = async () => {
        try {
            const res = await getTasks(name, id);
            setTasks(res)
            setErrorMsg("");
        } catch (err) {
            console.error(err);
            setErrorMsg("Error: Failed to acquire tasks.");
        }
    }

    const handleAddTasks = async () => {
        try {
            console.log("taskname: ", taskParams[0])
            const res = await createTask(name, id, ...taskParams);
            handleGetTasks();
            setErrorMsg("");
        } catch (err) {
            console.error(err);
            setErrorMsg("Error: Could not create task.");
        }
    }

    const handleRemove = async (taskId) => {
        try {
            await removeTask(name, id, taskId)
            handleGetTasks();
            setErrorMsg("");
        } catch (err) {
            console.error(err);
            setErrorMsg(`Error: could not remove task: ${taskId}`);
        }
    }

    const handleLogout = async () => {
        await authLogout(name);
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    const handleSettingsClick = (e) => {
        e.preventDefault();
        alert("Settings feature is coming soon!");
        setShowProfileMenu(false);
    };

    useEffect(() => {
        handleGetTasks();
    }, [])

    return (
        <div className="taskPgcontainer">
            <header className="app-header">
                <h1 className="app-title">Tasks</h1>
                <div className="profile-section">
                    <div
                        className="profile-icon"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    {showProfileMenu && (
                        <div className="profile-dropdown">
                            <div className="profile-info">
                                <span className="username">{name}</span>
                            </div>
                            <Link
                                to={`/home/${name}`}
                                className="dropdown-item"
                                onClick={() => setShowProfileMenu(false)}
                            >
                                Home
                            </Link>
                            <a
                                href={`/home/${name}`}
                                className="dropdown-item"
                                onClick={handleSettingsClick}
                            >
                                Settings
                            </a>

                            <button id="logout-button" onClick={handleLogout} className="dropdown-item">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </header>
            <div className="centered-form-container">
                <div className="login-card">
                    <h2>Create new Task:</h2>
                    <p><label>Name: <input className="login-input" id="taskName" type="text" placeholder="Enter a name..." maxLength={250} required onChange={() => {
                        const inputVal = document.getElementById("taskName").value;
                        setTaskParams([inputVal.length? inputVal : "Task", taskParams[1], taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Description: <input className="login-input" id="taskDesc" type="text" placeholder="None" maxLength={2500} onChange={() => {
                        const inputVal = document.getElementById("taskDesc").value;
                        setTaskParams([taskParams[0], inputVal? inputVal : "None", taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Priority: <input className="login-input" id="taskPriority" type="text" placeholder="M" onChange={() => {
                        const inputVal = document.getElementById("taskPriority").value;
                        setTaskParams([taskParams[0], taskParams[1], inputVal? inputVal : "M", taskParams[3]]);
                    }}/></label></p>
                    <p><label>Status: <input className="login-input" id="taskStatus" type="text" placeholder="NS" onChange={() => {
                        const inputVal = document.getElementById("taskStatus").value;
                        setTaskParams([taskParams[0], taskParams[1], taskParams[2], inputVal? inputVal : "NS"]);
                    }}/></label></p>
                    <button className="login-button" onClick={handleAddTasks}>Create Task</button>
                    {errorMsg &&
                        <p style={{color: 'red'}}>{errorMsg}</p>
                    }
                </div>
            </div>
            <div>
                {tasks.length? tasks.map((task) => (
                    <Task
                        taskName={task.fields.name}
                        taskId={task.pk}
                        boardId={id}
                        description={task.fields.description}
                        priority={task.fields.priority}
                        status={task.fields.status}
                        handleGetTasks={handleGetTasks}
                    >
                        <button id="remove-button" className="task-button" onClick={() => handleRemove(task.pk)}>Remove task</button>
                    </Task>
                )): <p style={{textAlign: "center"}}></p>}
            </div>
        </div>
    );
};

export default Board;
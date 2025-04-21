import { useParams } from "react-router-dom";
import { getTasks, removeTask, createTask, editTask } from "../api/tasks"
import { useEffect, useState } from "react";
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

    useEffect(() => {
        handleGetTasks();
    }, [])

    return (
        <div className="taskPgcontainer">
            <h1 style={{textAlign: "center"}}>Tasks</h1>
            <div  className="tasksContainer">
                <div className="login-card">
                <h2>Create new Task:</h2>
                    <p><label>Name: <input className="login-input" id="taskName" type="text" placeholder="Enter a name..." maxLength={250} required onChange={() => {
                        setTaskParams([document.getElementById("taskName").value, taskParams[1], taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Description: <input className="login-input" id="taskDesc" type="text" placeholder="None" maxLength={2500} onChange={() => {
                        setTaskParams([taskParams[0], document.getElementById("taskDesc").value, taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Priority: <input className="login-input" id="taskPriority" type="text" placeholder="M" onChange={() => {
                        setTaskParams([taskParams[0], taskParams[1], document.getElementById("taskPriority").value, taskParams[3]]);
                    }}/></label></p>
                    <p><label>Status: <input className="login-input" id="taskStatus" type="text" placeholder="NS" onChange={() => {
                        setTaskParams([taskParams[0], taskParams[1], taskParams[2], document.getElementById("taskStatus").value]);
                    }}/></label></p>
                    <button className="login-button" onClick={handleAddTasks}>Create Task</button>
                    {errorMsg && 
                        <p style={{color: 'red'}}>{errorMsg}</p>
                    }
                <Link to={`/home/${name}`}><p style={{textAlign: "center"}}>Home</p></Link>
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
                            <div className="taskButtonContainer">
                                <button className="task-button" onClick={() => handleRemove(task.pk)}>Remove task</button>
                            </div>
                        </Task>
                    )): <p style={{textAlign: "center"}}></p>}
                </div>
            </div>
        </div>
    );
};

export default Board;
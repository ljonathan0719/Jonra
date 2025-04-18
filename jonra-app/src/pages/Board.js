import { useParams } from "react-router-dom";
import { getTasks } from "../api/tasks.js"
import { useEffect, useState } from "react";
import { Task } from "./Task.js";
import { Link } from "react-router-dom";
import { removeTask, createTask } from "../api/tasks";
import "./task-style.css";

const Board = () => {

    const { name, id } = useParams();
    const [tasks, setTasks] = useState([]);
    const [taskParams, setTaskParams] = useState(["", "None", "M", "NS"]);

    const handleGetTasks = async () => {
        const res = await getTasks(name, id);
        setTasks(res)
    }

    const handleAddTasks = async () => {
        const res = await createTask(name, id, ...taskParams);

        handleGetTasks();
    }

    const handleRemove = async (taskName) => {
        await removeTask(name, id, taskName)
        handleGetTasks();
    }

    useEffect(() => {
        handleGetTasks();
    }, [])

    return (
        <div>
            <h1 style={{textAlign: "center"}}>Tasks</h1>
                <h2>Create new Task:</h2>
                <div>
                    <p><label>Name: <input id="taskName" type="text" required onChange={() => {
                        setTaskParams([document.getElementById("taskName").value, taskParams[1], taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Description: <input id="taskDesc" type="text" placeholder="None" onChange={() => {
                        setTaskParams([taskParams[0], document.getElementById("taskDesc").value, taskParams[2], taskParams[3]]);
                    }}/></label></p>
                    <p><label>Priority: <input id="taskPriority" type="text" placeholder="M" onChange={() => {
                        setTaskParams([taskParams[0], taskParams[1], document.getElementById("taskDesc").value, taskParams[3]]);
                    }}/></label></p>
                    <p><label>Status: <input id="taskStatus" type="text" placeholder="NS" onChange={() => {
                        setTaskParams([taskParams[0], taskParams[1], taskParams[2], document.getElementById("taskDesc").value]);
                    }}/></label></p>
                    <button onClick={handleAddTasks}>Create Task</button>
                </div>
                {tasks.length? tasks.map((task) => (
                    <Task
                        taskName={task.fields.name}
                        boardId={id}
                        description={task.fields.description}
                        priority={task.fields.priority}
                        status={task.fields.status}
                    >
                        <div className="taskButtonContainer">
                            <button className="taskButton" onClick={() => handleRemove(task.fields.name)}>Remove task</button>
                        </div>
                    </Task>
                )): <p style={{textAlign: "center"}}>No tasks.</p>}
            <Link to={`/home/${name}`}><p style={{textAlign: "center"}}>Home</p></Link>
        </div>
    );
};

export default Board;
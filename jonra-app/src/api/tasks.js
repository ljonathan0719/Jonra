import axios, { HttpStatusCode } from 'axios'
import root_url from './info';

// Primary Backend url to communicate with
// const root_url = "http://127.0.0.1:8000/";

// Get home page url from given parameters
const getRootUrl = (username, boardId) => { return root_url + `home/${username}/board/${boardId}`; }

// API for getting all tasks from user in the board with the given board ID
export const getTasks = async (username, boardId) => {
    const res = await axios.get(getRootUrl(username, boardId), { withCredentials: true });
    if (res.status >= 400) return res;
    const tasks = JSON.parse(res.data.tasks);
    return tasks.reverse();
}

// API for getting a task from given user and board with the provided name
// Note: This only picks one task if there are many of the same name
export const getTaskFromName = async (username, boardId, taskName) => {
    const res = await getTasks(username, boardId);
    let taskObj;
    res.forEach(task => {
        if (task.fields.name === taskName) taskObj = task;
    });
    return taskObj;
}

// API for getting a task from given user and board with the provided ID
export const getTaskFromId = async (username, boardId, taskId) => {
    const res = await getTasks(username, boardId);
    let taskObj;
    res.forEach(task => {
        if (task.pk === taskId) taskObj = task;
    });
    console.log(taskObj);
    return taskObj;
}

// API for removing a task with given ID from user's board
export const removeTask = async (username, boardId, taskId) => {
    const res = await axios.delete(getRootUrl(username, boardId), {
        data: {
            taskId: taskId
        }});
    return res;
}

// API for creating a task with given ID from user's board with specified options
export const createTask = async (username, boardId, taskName, description, priority, taskStatus) => {
    const res = await axios.post(getRootUrl(username, boardId), {
        taskName: taskName,
        description: description,
        priority: priority,
        taskStatus: taskStatus
    }, { withCredentials: true });
    return res;
}

// API for editing a task with given ID from user's board with updated fields
export const editTask = async (username, boardId, taskId, taskName, taskDesc, taskPriority, taskStatus) => {
    const taskNameParam = taskName? `&taskName=${taskName}` : "";
    const taskDescParam = taskDesc? `&taskDesc=${taskDesc}` : "";
    const taskPriorityParam = taskPriority? `&taskPriority=${taskPriority}` : "";
    const taskStatusParam = taskStatus? `&taskStatus=${taskStatus}` : "";
    const res = await axios.patch(
        getRootUrl(username, boardId) + `/edit?taskId=${taskId}` + taskNameParam + taskDescParam + taskPriorityParam + taskStatusParam,
        { taskId: taskId }, { withCredentials: true }
    );
    return res; 
}

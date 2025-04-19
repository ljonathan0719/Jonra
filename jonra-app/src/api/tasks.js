import axios, { HttpStatusCode } from 'axios'

const getRootUrl = (username, boardId) => { return `http://127.0.0.1:8000/home/${username}/board/${boardId}`; }


export const getTasks = async (username, boardId) => {
    const res = await axios.get(getRootUrl(username, boardId));
    if (res.status >= 400) return res;
    const tasks = JSON.parse(res.data.tasks);
    return tasks.reverse();
}

export const getTaskFromName = async (username, boardId, taskName) => {
    const res = await getTasks(username, boardId);
    let taskObj;
    res.forEach(task => {
        if (task.fields.name === taskName) taskObj = task;
    });
    return taskObj;
}

export const getTaskFromId = async (username, boardId, taskId) => {
    const res = await getTasks(username, boardId);
    let taskObj;
    res.forEach(task => {
        if (task.pk === taskId) taskObj = task;
    });
    console.log(taskObj);
    return taskObj;
}

export const removeTask = async (username, boardId, taskname) => {
    const res = await axios.delete(getRootUrl(username, boardId), {
        data: {
            taskname: taskname
        }});
    return res;
}

export const createTask = async (username, boardId, taskName, description, priority, taskStatus) => {
    const res = await axios.post(getRootUrl(username, boardId), {
        taskName: taskName,
        description: description,
        priority: priority,
        taskStatus: taskStatus
    });
    return res;
}

export const editTask = async (username, boardId, taskId, taskName, taskDesc, taskPriority, taskStatus) => {
    const taskNameParam = taskName? `&taskName=${taskName}` : "";
    const taskDescParam = taskDesc? `&taskDesc=${taskDesc}` : "";
    const taskPriorityParam = taskPriority? `&taskPriority=${taskPriority}` : "";
    const taskStatusParam = taskStatus? `&taskStatus=${taskStatus}` : "";
    const res = await axios.patch(
        getRootUrl(username, boardId) + `/edit?taskId=${taskId}` + taskNameParam + taskDescParam + taskPriorityParam + taskStatusParam,
        { taskId: taskId }
    );
    return res; 
}

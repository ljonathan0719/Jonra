import axios from 'axios'

export const getTasks = async (username, boardId) => {
    const res = await axios.get(`http://127.0.0.1:8000/home/${username}/board/${boardId}`);
    const tasks = JSON.parse(res.data.tasks);
    return tasks;
}

export const removeTask = async (username, boardId, taskname) => {
    const res = await axios.delete(
        `http://127.0.0.1:8000/home/${username}/board/${boardId}`, {
        data: {
            taskname: taskname
        }
    })
    return res;
}

export const createTask = async (username, boardId, taskName, description, priority, taskStatus) => {
    const res = await axios.post(`http://127.0.0.1:8000/home/${username}/board/${boardId}`, {
        taskName: taskName,
        description: description,
        priority: priority,
        taskStatus: taskStatus
    })
    return res;
}

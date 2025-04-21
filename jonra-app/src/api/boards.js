import axios from "axios";
import root_url from './info';

// Primary Backend url to communicate with
// const root_url = "http://127.0.0.1:8000/";

/*
 * Data format:
 * boards
    : 
    "[{\"model\": \"models.board\", \"pk\": 1, \"fields\": {\"name\": \"Kanban\", \"editors\": [\"jonathan\"]}}]"
    username
    : 
    "jonathan"
 */

// API to acquire all boards from user with given username
export const getBoards = async (username) => {
    console.log(username);
    const res = await axios.get(root_url + `home/${username}`);
    return res;
}

// API to create a new board for the user with the provided name
export const createBoards = async (username, boardname) => {

    const res = await axios.post(root_url + `home/${username}/createboard/${boardname}`, {
        username: username,
        boardname: boardname
    });
    return res;
}

// API to remove a board with the given backend ID
export const deleteBoards = async (username, boardId) => {
    const res = await axios.delete(root_url + `home/${username}/deleteboard/${boardId}`, {
        username: username,
        boardId: boardId
    });
    return res;
}
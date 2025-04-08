import axios from "axios";

/*
 * Data format:
 * boards
    : 
    "[{\"model\": \"models.board\", \"pk\": 1, \"fields\": {\"name\": \"Kanban\", \"editors\": [\"jonathan\"]}}]"
    username
    : 
    "jonathan"
 */
export const getBoards = async (username) => {
    console.log(username);
    const res = await axios.get(`http://127.0.0.1:8000/home/${username}`);
    return res;
}

export const createBoards = async (username, boardname) => {
    
}

export const editBoard = async (username, boardname) => {

}

export const deleteBoards = async (username) => {

}

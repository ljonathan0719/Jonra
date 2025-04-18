import axios from "axios";

export const authLogout = async (username) => {
    console.log(username)
    const res = await axios.get(`http://127.0.0.1:8000/logout/${username}`);
    return res;
}

export const authLogin = async (user) => {
    const res = await axios.post(`http://127.0.0.1:8000/auth/${user}`);
    return res;
}

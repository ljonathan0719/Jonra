import axios from "axios";

const root_url = "http://127.0.0.1:8000/"

export const authLogout = async (username) => {
    const res = await axios.get(root_url + `logout/${username}`);
    return res;
}

export const authLogin = async (user) => {
    const res = await axios.post(root_url + `login/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}

export const authSignup = async (user) => {
    const res = await axios.post(root_url + `signup/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}
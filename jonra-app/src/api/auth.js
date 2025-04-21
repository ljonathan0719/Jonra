import axios from "axios";
import root_url from './info';


// Primary Backend url to communicate with
// const root_url = "http://127.0.0.1:8000/";

// API to logout out the user with the given username
export const authLogout = async (username) => {
    const res = await axios.get(root_url + `logout/${username}`);
    return res;
}

// API to login the user with the given username
export const authLogin = async (user) => {
    const res = await axios.post(root_url + `login/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}

// API to add the new user with user object
export const authSignup = async (user) => {
    const res = await axios.post(root_url + `signup/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}
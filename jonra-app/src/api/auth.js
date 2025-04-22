import axios from "axios";
import root_url from './info';

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

// Checks whether locally stored user is same as given one
export const verifyUser = (username) => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername || storedUsername !== username) {
        return false;
    }
    return true;
}

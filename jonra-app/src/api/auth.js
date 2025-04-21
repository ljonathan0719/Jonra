import axios from "axios";

export const authLogout = async (username) => {
    // console.log(process.env.BACKEND_URI);
    const res = await axios.get(`http://127.0.0.1:8000/logout/${username}`);
    return res;
}

export const authLogin = async (user) => {
    // console.log(process.env.BACKEND_URI);

    const res = await axios.post(`http://127.0.0.1:8000/login/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}

export const authSignup = async (user) => {
    // console.log(process.env.BACKEND_URI);
    const res = await axios.post(`http://127.0.0.1:8000/signup/`, {
        user: user.username,
        password: user.password,
    });
    return res;
}
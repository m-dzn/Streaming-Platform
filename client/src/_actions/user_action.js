import axios from "axios";
import { USER_SERVER } from "../config";
import { LOGIN_USER, REGISTER_USER, AUTH_USER, LOGOUT_USER } from "./types";

export function registerUser(registerForm) {
    const payload = axios
        .post(`${USER_SERVER}/register`, registerForm)
        .then((response) => response.data);

    return {
        type: REGISTER_USER,
        payload,
    };
}

export function loginUser(loginForm) {
    const payload = axios
        .post(`${USER_SERVER}/login`, loginForm)
        .then((response) => response.data);

    return {
        type: LOGIN_USER,
        payload,
    };
}

export function auth() {
    const payload = axios
        .get(`${USER_SERVER}/auth`)
        .then((response) => response.data);

    return {
        type: AUTH_USER,
        payload,
    };
}

export function logoutUser() {
    const payload = axios
        .get(`${USER_SERVER}/logout`)
        .then((response) => response.data);

    return {
        type: LOGOUT_USER,
        payload,
    };
}

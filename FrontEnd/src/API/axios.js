// api/axios.js

import axios from "axios";

export const backendBaseUrl = "http://localhost:8000";
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default axiosInstance;

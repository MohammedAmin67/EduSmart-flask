import axios from "axios";
import { logoutUserOn401 } from "../utils/logoutHandler.js";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logoutUserOn401(); 
    }
    return Promise.reject(error);
  }
);

export default API;
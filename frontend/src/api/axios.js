import axios from "axios";
import { logoutUserOn401 } from "../utils/logoutHandler.js";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("authToken");
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
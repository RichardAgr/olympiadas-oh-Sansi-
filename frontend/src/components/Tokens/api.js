// api.js
import axios from "axios";

const authToken = localStorage.getItem("authToken");

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;

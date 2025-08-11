// src/api.ts
import axios from "axios";

const API_ROOT =
  (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.replace(/\/$/, "")) ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://choice-haat-backend-npzd.onrender.com");

export const API_BASE = `${API_ROOT}/api`;

// Single axios instance for the whole app
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default api;

/** Helper to build full image URL from the backend */
export const imageUrl = (fileName?: string) =>
  fileName ? `${API_ROOT}/uploads/${fileName}` : "";

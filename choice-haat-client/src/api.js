// src/api.js
import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';


const PROD_API_URL = 'https://choice-haat-backend-npzd.onrender.com/api';

const api = axios.create({
  baseURL: isProd ? PROD_API_URL : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;


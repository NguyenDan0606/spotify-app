import axios from "axios"
import {ACCESS_TOKEN} from "./constans"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json"
    }
  });

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem(ACCESS_TOKEN);
  
      // Đừng thêm token khi đang gọi tới endpoint login
      if (token && !config.url.includes("/api/token/")) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
export default api
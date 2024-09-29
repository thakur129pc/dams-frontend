import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://localhost:4000/api/v1/webUser/",
});

apiClient.interceptors.request.use(
  (config) => {
    if (!config.headers["skipAuth"]) {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } else {
      delete config.headers["skipAuth"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
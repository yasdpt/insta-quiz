import axios from "axios";

// initializing the axios instance with custom configs
const api = axios.create({
  headers: {
    Authorization: `Bearer ${window.Telegram.WebApp.initData}`,
  },
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000, // in miliseconds
});

// defining a custom error handler for all APIs
const errorHandler = (error: any) => {
  const statusCode = error.response?.status;

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error);
  }

  if (statusCode === 401) {
    Telegram.WebApp.close();
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

export default api;

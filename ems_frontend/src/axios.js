import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  // withCredentials: false, // Not needed for token-based auth
});

// Request interceptor to add Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;


// import axios from "axios";
// import Cookies from "js-cookie"

// const axiosInstance = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api',
//       // withCredentials: true, 
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('auth_token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error)
// )
// export default axiosInstance
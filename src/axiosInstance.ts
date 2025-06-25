// axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://remarker.onrender.com/api', // 🔁 Replace with your API base URL
  timeout: 10000, // optional: request timeout in ms
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${yourToken}` // optional: for auth
  }
});

// // Optional: Add interceptors
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Add auth token or custom logic here
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle error globally
//     console.error('API error:', error);
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;

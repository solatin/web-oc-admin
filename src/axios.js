import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    "Content-Type": "application/json",
  }
})

axiosClient.interceptors.request.use(
  request => {
    const token = localStorage.getItem('token');
    if (!request.headers.Authorization && token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  error => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response.code === 403) {
      window.location = '/login'
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient
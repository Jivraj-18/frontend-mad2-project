import axios from 'axios'

const axiosFetch = axios.create({
    baseURL: 'https://my-mad2-project.onrender.com/',
})

const authToken = localStorage.getItem('authToken');

// Add authentication header to all requests
axiosFetch.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosFetch

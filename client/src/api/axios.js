import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        if (err.response?.data?.code === 'TOKEN_EXPIRED') {
            await api.post('/auth/refresh');
            return api(err.config);
        }
        return Promise.reject(err);
    }
);

export default api;
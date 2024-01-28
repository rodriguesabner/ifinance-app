import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.15.16:8000"
})


api.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJlbWFpbCI6ImFibmVyQGdtYWlsLmNvbSIsImV4cCI6MTcwNjUwMjgzMiwiaWQiOiI2NWI2OWUxMDFlNTQ4Y2I3YWYzN2UyZmEifQ.H-vYoYSfjWxabhGZPwHKK6B9s1D68wL_0lRR_cGifrU'
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default api

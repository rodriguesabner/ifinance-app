import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
})

api.interceptors.request.use(
    async (config) => {
        let value: any = await AsyncStorage.getItem('@iFinance-status')

        if(value != null) {
            value = JSON.parse(value);
            config.headers['Authorization'] = value.token
        }

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

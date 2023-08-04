import axios from "axios";
import { localStorageUtil } from '../../util';

class API {
    constructor({
        contentType = "application/json",
    }) {
        /**
         * _apiClient is meant to be a private variable but since it is difficult to implement private variables in ES6
         * Please maintain the integrity at consumer level to not taint this variable
         */
        this._apiClient = axios.create({
            baseURL: "",
            headers: {
                Accept: 'application/json, text/plain',
                "Content-Type": contentType
            }
        });

        this._apiClient.interceptors.request.use(
            (config) => {
                const token = localStorageUtil.getItem('user')?.jwtToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // By adding interceptors to the Axios instance, we can customize the behavior of our API calls globally, without having to modify each function individually
        this._apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error?.code === 'ERR_NETWORK') {
                    // localStorageUtil.clear();
                    window.location.href = '/';
                }

                if ([400, 403, 406].includes(error.response?.status)) {
                    // added response to errorReponse, otherwise axios was not giving response property for rejected promise
                    // Issue reference: https://github.com/axios/axios/issues/960
                    error.errorReponse = error.response;
                    return Promise.reject(error);
                } else {
                    return Promise.reject(error);
                }
            }
        );
    }

    get = async function(endpoint, params) {
        try {
            const response = await this._apiClient.get(`${endpoint}`, {
                params
            });
            return response;
        } catch (error) {
            throw error;
        }
    }

    post = async function(endpoint, data) {
        try {
            const response = await this._apiClient.post(`${endpoint}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    put = async function(endpoint, data) {
        try {
            const response = await this._apiClient.put(`${endpoint}`, data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    delete = async function(endpoint){
        try {
            const response = await this._apiClient.delete(`${endpoint}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

const axiosJSON = new API('application/json');

export { axiosJSON };
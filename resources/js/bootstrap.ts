import axios, { AxiosInstance } from 'axios';

declare global {
    interface Window {
        axios: AxiosInstance;
    }
}

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // Required for sending cookies with requests
window.axios.defaults.withXSRFToken = true; // Automatically sends X-XSRF-TOKEN header

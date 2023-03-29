import axios from "axios";

axios.defaults.baseURL = "https://drf-api-alexa.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

/* axios request */
export const axiosReq = axios.create();
/* axios response */
export const axiosRes = axios.create();

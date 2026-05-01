import API from "../api/api";

const API = axios.create({
  baseURL: "http://localhost:8282/api"
});

export default API;
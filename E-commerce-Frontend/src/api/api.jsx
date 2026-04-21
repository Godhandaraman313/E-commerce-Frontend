import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8282/api"
});

export default API;
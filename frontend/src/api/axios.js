import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7134/api/"
});

export default api;
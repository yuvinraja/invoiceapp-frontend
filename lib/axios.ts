import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust if using reverse proxy
  withCredentials: true, // Send cookies (JWT)
})

export default api

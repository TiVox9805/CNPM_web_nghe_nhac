import axios from "axios";

const API_URL =
	import.meta.env.VITE_API_URL ||
	"http://localhost:5000";

console.log("🔌 API_URL:", API_URL); // Debug log
console.log("🔌 VITE_API_URL:", import.meta.env.VITE_API_URL); // Debug log

export const axiosInstance = axios.create({
	baseURL: `${API_URL}/api`,
});
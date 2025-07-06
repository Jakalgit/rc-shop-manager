import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const $host = axios.create({
	baseURL: `${backendUrl}/api`,
})

export {
	$host,
}
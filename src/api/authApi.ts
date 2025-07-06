import {$host} from "./index.ts";

export const auth = async (login: string, password: string) => {
	const {data} = await $host.post('/auth/login', {login, password});
	return data;
}

export const checkAct = async (token: string) => {
	const {data} = await $host.get('/auth/checkAct', {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
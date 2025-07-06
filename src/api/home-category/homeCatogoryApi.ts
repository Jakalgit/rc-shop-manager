import {$host} from "../index.ts";
import type {HomeCategoryResponse} from "./types.ts";

export const getHomeCategories = async (): Promise<HomeCategoryResponse[]> => {
	const {data} = await $host.get('/home-category');
	return data;
}

export const createHomeCategory = async ({formData, act}: {formData: FormData, act: string})=> {
	const {data} = await $host.post('/home-category', formData, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const deleteHomeCategory = async ({id, act}: {id: number, act: string}) => {
	const {data} = await $host.delete(`/home-category/${id}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}
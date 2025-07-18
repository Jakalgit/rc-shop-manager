import {$host} from "../index.ts";
import type {SlideResponse} from "./types.ts";

export const updateSlides = async (formData: FormData, token: string) => {
	const {data} = await $host.post('/promotion-slider', formData, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const getSlides = async (): Promise<SlideResponse[]> => {
	const {data} = await $host.get('/promotion-slider');
	return data;
}
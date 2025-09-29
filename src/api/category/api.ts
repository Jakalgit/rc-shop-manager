import {$host} from "../index.ts";
import type {CategoryBlockResponse, CategoryLinkResponse, CategorySubBlockResponse} from "./types.ts";

export const getCategories = async (token: string): Promise<{blocks: CategoryBlockResponse[], links: CategoryLinkResponse[], subBlocks: CategorySubBlockResponse[]}> => {
	const {data} = await $host.get('/category-block/adm', {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const updateCategories = async (formData: FormData, token: string): Promise<void> => {
	const {data} = await $host.post('/category-block/update', formData, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
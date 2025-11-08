import {$host} from "..";
import type {ProductGroup, ProductGroupResponse} from "./types.ts";


export const createProductGroup = async ({name, token}: {name: string, token: string}) => {
	const {data} = await $host.post('/product-group', {name}, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const getProductGroups = async (
	{finder, page, pageCount, token}: {finder: string, page: number, pageCount: number, token: string}
): Promise<ProductGroupResponse> => {
	const {data} = await $host.get(
		`/product-group/list?page=${page}&pageCount=${pageCount}&finder=${finder}`,
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const getProductGroup = async (
	{id, token}: {id: number, token: string}
): Promise<ProductGroup> => {
	const {data} = await $host.get(
		`/product-group/single/${id}`,
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const updateProductGroup = async (groupData: ProductGroup, token: string) => {
	const {data} = await $host.put('/product-group/update', groupData, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const deleteProductGroup = async (groupId: number, token: string) => {
	const {data} = await $host.delete(`/product-group/remove/${groupId}`, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
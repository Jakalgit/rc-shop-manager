import {$host} from "../index.ts";
import type {GetProductPagination, ProductPaginationResponse} from "./types.ts";

export const createProduct = async (formData: FormData, act: string): Promise<void> => {
	const {data} = await $host.post('/product', formData, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const updateProduct = async (formData: FormData, id: number, act: string): Promise<void> => {
	const {data} = await $host.put(`/product/${id}`, formData, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const getProductPagination = async (
	params: GetProductPagination, act: string
): Promise<ProductPaginationResponse> => {

	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		if (Array.isArray(value)) {
			value.forEach(v => searchParams.append(key, String(v)));
		} else {
			searchParams.append(key, String(value));
		}
	});

	const str = searchParams.toString();

	const {data} = await $host.get(
		`/product/catalog${str.length > 0 ? `?${str}` : ''}`,
		{headers: {Authorization: `Bearer ${act}`}}
	);
	return data;
}
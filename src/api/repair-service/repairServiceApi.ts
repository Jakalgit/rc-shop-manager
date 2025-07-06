import {$host} from "../index.ts";
import type {RepairServiceResponse} from "./types.ts";

export const updateServices = async (
	{items, act}: {items: {service: string, price: string}[], act: string}
) => {
	const {data} = await $host.post('/repair-service', {items}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const getServices = async (): Promise<RepairServiceResponse[]> => {
	const {data} = await $host.get('/repair-service');
	return data;
}
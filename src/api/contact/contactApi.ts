import {$host} from "../index.ts";
import type {ContactResponse} from "./types.ts";

export const updateContacts = async (
	{phone, address, email, act}: {phone: string, address: string, email: string, act: string},
) => {
	const {data} = await $host.put('/contact', {phone, address, email}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const getContacts = async (): Promise<ContactResponse> => {
	const {data} = await $host.get(`/contact`);
	return data;
}
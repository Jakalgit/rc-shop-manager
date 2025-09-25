import {$host} from "../index.ts";
import type {ContactResponse} from "./types.ts";

export const updateContacts = async (
	{act, ...rest}:
	{phone: string, address: string, email: string, tgIdentifier: string, whatsappIdentifier: string, workTime: string, act: string},
) => {
	const {data} = await $host.put('/contact', rest, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const getContacts = async (): Promise<ContactResponse> => {
	const {data} = await $host.get(`/contact`);
	return data;
}
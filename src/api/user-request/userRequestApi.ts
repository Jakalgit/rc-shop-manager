import {$host} from "../index.ts";
import type {UserReqResponse} from "./types.ts";

export const getUserRequests = async (
	{page, limit, act}: {page: number, limit: number, act: string}
): Promise<UserReqResponse> => {
	const {data} = await $host.get(`/user-request?page=${page}&limit=${limit}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const setCheckedRequest = async ({id, act}: {id: number; act: string}) => {
	const {data} = await $host.put(`/user-request/set-checked/${id}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}
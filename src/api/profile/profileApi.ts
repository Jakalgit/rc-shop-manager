import {$host} from "../index.ts";
import {type PartnersPaginationResponse, ProfileStatusEnum} from "./types.ts";

export const updatePartnerStatus = async (
	{id, status, token}: {id: string, status?: ProfileStatusEnum, token: string},
): Promise<{ok: boolean}> => {
	const {data} = await $host.put('/profile/partner-status', {id, status}, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const getPartnersProfiles = async (
	{page, limit, token, status}:
	{page: number, limit: number, status?: ProfileStatusEnum, token: string}
): Promise<PartnersPaginationResponse> => {
	const {data} = await $host.get(
		`/profile/partners?page=${page}&limit=${limit}${status && `&status=${status.toString()}`}`,
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const deleteProfile = async ({id, token}: {id: string, token: string}): Promise<{ok: boolean}> => {
	const {data} = await $host.delete(`/profile/${id}`, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
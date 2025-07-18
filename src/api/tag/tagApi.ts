import {$host} from "../index.ts";
import type {TagResponse} from "./types.ts";

export const getAllTags = async (
	{groupId, act}: {groupId?: number, act: string}
): Promise<TagResponse[]> => {
	const {data} = await $host.get(`/tag/all${groupId ? `?groupId=${groupId}` : ''}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const getAllGroups = async (act: string) => {
	const {data} = await $host.get(`/tag/all/groups`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const createNewTag = async (name: string, act: string) => {
	const {data} = await $host.post(`/tag/create-tag`, {name}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const updateTag = async (
	{id, groupId, name, act}: {id: number, groupId: number | null, name: string, act: string}
) => {
	const {data} = await $host.put('/tag/update-tag', {id, groupId, name}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const deleteTag = async ({id, act}: {id: number, act: string}) => {
	const {data} = await $host.delete(`/tag/delete-tag/${id}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const createGroup = async ({name, act}: {name: string, act: string}) => {
	const {data} = await $host.post('/tag/create-group', {name}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const updateGroup = async (
	{id, name, act}: {id: number, name: string, act: string}
) => {
	const {data} = await $host.put('/tag/update-group', {id, name}, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}

export const deleteGroup = async ({id, act}: {id: number, act: string}) => {
	const {data} = await $host.delete(`/tag/delete-group/${id}`, {headers: {Authorization: `Bearer ${act}`}});
	return data;
}
import {$host} from "../index.ts";
import type {ChatResponse, ChatMessage} from "./types.ts";

export const getChatList = async (
	{page, pageCount, token}: {page: number, pageCount: number, token: string}
): Promise<ChatResponse> => {
	const {data} = await $host.get(
		`/support-chat/chats?page=${page}&pageCount=${pageCount}`,
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}

export const getChatMessages = async (
	{clientId}: {clientId: string}
): Promise<ChatMessage[]> => {
	const {data} = await $host.get(`/support-chat/messages/${clientId}`);
	return data;
}

export const sendMessage = async (
	{message, clientId, token}: {message: string, clientId: string, token: string}
) => {
	const {data} = await $host.post(
		`/support-chat/send-ad`,
		{message, clientId},
		{headers: {Authorization: `Bearer ${token}`}}
	);
	return data;
}
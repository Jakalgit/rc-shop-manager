
export type Chat = {
	id: string;
	name: string;
	clientId: string;
	lastMessage?: {
		message: string;
		fromUser: boolean;
		chatId: string;
	};
}

export type ChatResponse = {
	records: Chat[];
	totalPages: number;
}

export type ChatMessage = {
	message: string;
	fromUser: boolean;
}
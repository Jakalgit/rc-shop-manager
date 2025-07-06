
export type UserRequest = {
	id: number;
	name: string;
	phone: string;
	text?: string;
	checked: boolean;
}

export type UserReqResponse = {
	records: UserRequest[];
	totalPages: number;
}
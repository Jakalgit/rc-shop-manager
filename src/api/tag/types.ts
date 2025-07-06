
export type TagResponse = {
	id: number;
	name: string;
	groupId?: number;
	createdAt: string;
	updatedAt: string;
}

export type GroupResponse = {
	id: number;
	name: string;
	tags: TagResponse[];
}
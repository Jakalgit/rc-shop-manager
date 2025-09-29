
export type CategoryBlockResponse = {
	id: number;
	blockText: string;
	index: number;
	preview: {filename: string, imageId?: number, clientId?: number};
}

export type CategoryLinkResponse = {
	id: number;
	link: string;
	linkText: string;
	index: number;
	categoryBlockId: number;
}

export type CategorySubBlockResponse = {
	id: number;
	blockLink: string;
	name: string;
	index: number;
	preview: {filename: string, imageId?: number, clientId?: number};
	categoryBlockId: number;
}
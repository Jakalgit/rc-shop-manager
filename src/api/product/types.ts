
export interface GetProductPagination {
	id?: number;
	finder?: string;
	article?: string;
	limit?: number;
	page?: number;
	tagIds?: number[];
	productGroupId?: number;
}

export const DetailEnum = {
	DESCRIPTION: 'DESCRIPTION',
	SPECIFICATION: 'SPECIFICATION',
	EQUIPMENT: 'EQUIPMENT',
} as const;

export type DetailEnum = keyof typeof DetailEnum;

export type Detail = {
	id: number;
	index: number;
	text: string;
}

export type ProductResponse = {
	id: number;
	name: string;
	availability: boolean;
	visibility: boolean;
	article: string;
	count: number;
	price: number;
	oldPrice?: number;
	promotionPercentage?: number;
	weight?: number;
	height?: number;
	width?: number;
	length?: number;
	productGroupId?: number;
	createdAt?: Date;
	updatedAt?: Date;
	description: Detail[];
	specification: Detail[];
	equipment: Detail[];
	images: {
		index: number;
		filename: string;
		previewId: number;
		imageId: number;
	}[];
	tags: {
		id: number;
		name: string;
		groupId?: number;
		createdAt: string;
		updatedAt: string;
	}[]
}

export type ProductPaginationResponse = {
	records: ProductResponse[];
	totalPages: number;
}

export type ProductGroupResponse = {
	records: ProductGroup[];
	totalPages: number;
}

export type ProductGroup = {
	id: number;
	name: string;
}

export const PageEnum = {
	DELIVERY_AND_PAYMENTS: "DELIVERY_AND_PAYMENTS",
} as const;

export type PageBlockResponse = {
	id: number;
	title: string;
	description: string;
	pageType: typeof PageEnum;
}
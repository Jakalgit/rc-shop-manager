import {$host} from "../index.ts";
import {type PageBlockResponse, PageEnum} from "./types.ts";

export const getPageBlocks = async (pageType: typeof PageEnum[keyof typeof PageEnum]): Promise<PageBlockResponse[]> => {
	const {data} = await $host.get(`/page-block/${pageType}`);
	return data;
}

export const updatePageBlocks = async (
	{blocks, pageType, token}: {blocks: {title: string, description: string}[], pageType: typeof PageEnum[keyof typeof PageEnum], token: string},
) => {
	const {data} = await $host.post(`/page-block`, {blocks, pageType}, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
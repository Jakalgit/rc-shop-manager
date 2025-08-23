import TabsComponent from "../components/TabsComponent.tsx";
import Entries from "../components/partners/Entries.tsx";
import {getPartnersProfiles} from "../api/profile/profileApi.ts";
import {type PartnerResponse, ProfileStatusEnum} from "../api/profile/types.ts";
import Cookies from "universal-cookie";
import React from "react";

const Partners = () => {

	const cookies = new Cookies();

	const tabItems = [
		{
			title: "Заявки",
			eventKey: "requests",
			tsx: <Entries getData={getData} status={ProfileStatusEnum.PENDING} accept reject />,
		},
		{
			title: "Подтверждённые партнеры",
			eventKey: "active_partners",
			tsx: <Entries getData={getData} status={ProfileStatusEnum.ACTIVE} ban />,
		},
		{
			title: "Отклонённые заявки",
			eventKey: "rejected_requests",
			tsx: <Entries getData={getData} status={ProfileStatusEnum.REJECTED} accept remove />,
		},
		{
			title: "Заблокированные партнеры",
			eventKey: "banned_partners",
			tsx: <Entries getData={getData} status={ProfileStatusEnum.BANNED } accept remove />,
		}
	];

	async function getData(
		page: number,
		setItems: (value: React.SetStateAction<PartnerResponse[]>) => void,
		setTotalPages: (value: React.SetStateAction<number>) => void,
		setLoading: (value: React.SetStateAction<boolean>) => void,
		status: ProfileStatusEnum
	) {
		try {
			const act: string = cookies.get("act") || "";

			const response = await getPartnersProfiles({page, limit: 24, status, token: act});

			console.log(status);

			setTotalPages(response.totalPages);
			setItems(response.records);

			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	return (
		<TabsComponent items={tabItems} />
	);
};

export default Partners;
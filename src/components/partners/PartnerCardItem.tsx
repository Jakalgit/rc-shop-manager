import React, {useState} from 'react';
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import {type PartnerResponse, ProfileStatusEnum} from "../../api/profile/types.ts";
import {formatPhoneNumber} from "../../functions/format.ts";
import {deleteProfile, updatePartnerStatus} from "../../api/profile/profileApi.ts";
import Cookies from "universal-cookie";

interface IProps {
	item: PartnerResponse,
	accept?: boolean,
	reject?: boolean,
	remove?: boolean,
	ban?: boolean,
}

const PartnerCardItem: React.FC<IProps> = ({ item, accept, reject, remove, ban }) => {

	const cookies = new Cookies();

	const [loadingAcceptButton, setLoadingAcceptButton] = useState<boolean>(false);
	const [loadingRemoveButton, setLoadingRemoveButton] = useState<boolean>(false);
	const [loadingRejectButton, setLoadingRejectButton] = useState<boolean>(false);
	const [loadingBanButton, setLoadingBanButton] = useState<boolean>(false);

	const changeStatusRequest = async (
		setLoadingButton: (value: React.SetStateAction<boolean>) => void,
		status: ProfileStatusEnum
	) => {
		try {
			const act: string = cookies.get("act") || "";
			setLoadingButton(true);

			await updatePartnerStatus({id: item.id, status, token: act});

			setLoadingButton(false);

			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	const acceptRequest = async () => {
		await changeStatusRequest(setLoadingAcceptButton, ProfileStatusEnum.ACTIVE);
	}

	const rejectRequest = async () => {
		await changeStatusRequest(setLoadingRejectButton, ProfileStatusEnum.REJECTED);
	}

	const removeRequest = async () => {
		try {
			const act: string = cookies.get("act") || "";
			setLoadingRemoveButton(true);

			await deleteProfile({id: item.id, token: act});

			setLoadingRemoveButton(false);

			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	const banRequest = async () => {
		await changeStatusRequest(setLoadingBanButton, ProfileStatusEnum.BANNED);
	}

	return (
		<Col className="mt-3" md={12}>
			<Card className="w-100">
				<Card.Body>
					<Card.Title>
						{item.name}
					</Card.Title>
					<Row className="mt-4">
						<Card.Text>
							<strong>Номер телефона:</strong> <a href="">{formatPhoneNumber(item.phone)}</a>
						</Card.Text>
						<Card.Text>
							<strong>Email:</strong> <a href={`mailto:${item.email}`}>{item.email}</a>
						</Card.Text>
						<Card.Text>
							<strong>Описание деятельности (или ссылка на магазин):</strong><br/>
							{item.descriptionOfActivities}
						</Card.Text>
					</Row>
					<Row className="mt-4">
						{accept && (
							<Col md={2}>
								<Button
									variant="primary"
									className="w-100"
									onClick={acceptRequest}
								>
									{loadingAcceptButton ? (
										<Spinner animation="border" role="status">
											<span className="visually-hidden">Загрузка...</span>
										</Spinner>
									) : (
										"Активировать"
									)}
								</Button>
							</Col>
						)}
						{reject && (
							<Col md={2}>
								<Button
									variant="danger"
									className="w-100"
									onClick={rejectRequest}
								>
									{loadingRejectButton ? (
										<Spinner animation="border" role="status">
											<span className="visually-hidden">Загрузка...</span>
										</Spinner>
									) : (
										"Отклонить"
									)}
								</Button>
							</Col>
						)}
						{remove && (
							<Col md={2}>
								<Button
									variant="danger"
									className="w-100"
									onClick={removeRequest}
								>
									{loadingRemoveButton ? (
										<Spinner animation="border" role="status">
											<span className="visually-hidden">Загрузка...</span>
										</Spinner>
									) : (
										"Удалить запись"
									)}
								</Button>
							</Col>
						)}
						{ban && (
							<Col md={2}>
								<Button
									variant="danger"
									className="w-100"
									onClick={banRequest}
								>
									{loadingBanButton ? (
										<Spinner animation="border" role="status">
											<span className="visually-hidden">Загрузка...</span>
										</Spinner>
									) : (
										"Заблокировать"
									)}
								</Button>
							</Col>
						)}
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default PartnerCardItem;
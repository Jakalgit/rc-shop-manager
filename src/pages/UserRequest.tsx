import {Button, Card, Col, Container, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import {getUserRequests, setCheckedRequest} from "../api/user-request/userRequestApi.ts";
import type {UserRequest} from "../api/user-request/types.ts";
import PaginationComponent from "../components/PaginationComponent.tsx";

const UserRequestComponent = () => {

	const cookies = new Cookies();

	const [loading, setLoading] = useState(true);
	const [loadingMarkAsRead, setLoadingMarkAsRead] = useState(false);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	const [items, setItems] = useState<UserRequest[]>([]);

	const markAsRead = async (id: number) => {
		try {
			setLoadingMarkAsRead(true);
			const act: string = cookies.get("act") || "";

			await setCheckedRequest({id, act});
			await getData();

			alert("Успешно отмечено.");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setLoadingMarkAsRead(false);
	}

	async function getData() {
		try {
			const act: string = cookies.get("act") || "";

			const response = await getUserRequests({page, limit: 12, act});

			setTotalPages(response.totalPages);
			setItems(response.records);

			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	useEffect(() => {
		getData();
	}, [page]);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Загрузка...</span>
			</Spinner>
		)
	}

	return (
		<Container fluid>
			{items.length > 0 && (
				<>
					<Row className="mt-4">
						{items.map((item, index) =>
							<Col className="mt-3" key={index} lg={12}>
								<Card className="h-100">
									<Card.Body>
										<Row className="mb-3">
											<Col lg={4}>
												<Card.Title>
													Имя: {item.name}
												</Card.Title>
												<Card.Text>
													Номер телефона: {item.phone}
												</Card.Text>
											</Col>
											<Col lg={8}>
												<Card.Text>
													{item.text}
												</Card.Text>
											</Col>
										</Row>
										<Card.Text>
											Статус: {item.checked ? "Прочитано" : <strong>Не прочитано</strong>}
										</Card.Text>
										<Button
											variant="primary"
											onClick={() => markAsRead(item.id)}
											disabled={loadingMarkAsRead}
										>
											Пометить как прочитанное
										</Button>
									</Card.Body>
								</Card>
							</Col>
						)}
					</Row>
					<PaginationComponent
						currentPage={page}
						totalPages={totalPages}
						onPageChange={setPage}
						siblingCount={5}
					/>
				</>
			)}
		</Container>
	);
};

export default UserRequestComponent;
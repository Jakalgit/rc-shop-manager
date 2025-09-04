import {Card, Col, Container, Row} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import type {OrderResponse} from "../api/order/types.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import Cookies from "universal-cookie";
import {getAllOrders} from "../api/order/api.ts";
import PaginationComponent from "../components/PaginationComponent.tsx";
import {formatPhoneNumber} from "../functions/format.ts";
import {OrderStatusDescription} from "../consts/order-status-description.ts";
import {PathEnum} from "../consts/routes.tsx";
import Loading from "../components/Loading.tsx";

function Order() {

	const cookies = new Cookies();
	const [searchParams, _] = useSearchParams();
	const navigate = useNavigate();
	const page = Number(searchParams.get("page") || 1);

	const [orders, setOrder] = useState<OrderResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [totalPages, setTotalPages] = useState<number>(1);

	const onPageChange = useCallback((page: number) => {
		navigate({
			pathname: PathEnum.ORDERS,
			search: `?page=${page}`
		})
	}, []);

	async function getData() {
		try {
			const act = cookies.get("act") || "";

			const response = await getAllOrders({page, limit: 24, token: act});

			setOrder(response.records);
			setTotalPages(response.totalPages);

			setLoading(false);
		} catch (e: any) {
			console.error(e);
			alert(e.response?.data?.message);
		}
	}

	useEffect(() => {
		getData();
	}, [page]);

	if (loading) {
		return <Loading />
	}

	return (
		<Container fluid>
			{orders.map((order, index) =>
				<Col
					key={index}
					className="mt-3"
					md={12}
				>
					<Card className="w-100">
						<Card.Body>
							<Card.Title>
								<a href={`/order/${order.orderNumber}`}>Заказ {order.orderNumber}</a>
							</Card.Title>
							<Row className="mt-4">
								<Card.Text>
									<strong>Клиент:</strong> {order.guestName}
								</Card.Text>
								<Card.Text>
									<strong>Номер телефона:</strong> <a href={`tel:${order.guestPhone}`}>{formatPhoneNumber(order.guestPhone)}</a>
								</Card.Text>
								<Card.Text>
									<strong>Email:</strong> <a href={`mailto:${order.guestEmail}`}>{order.guestEmail}</a>
								</Card.Text>
								<Card.Text>
									<strong>Дата создания:</strong>&nbsp;
									{(new Date(order.createdAt)).toLocaleDateString("ru-RU", {
										day: "2-digit",
										month: "2-digit",
										year: "numeric",
									})}
								</Card.Text>
								<Card.Text>
									<strong>Статус заказа:</strong> {OrderStatusDescription[order.status]}
								</Card.Text>
								{order.comment && (
									<Card.Text>
										<strong>Комментарий:</strong><br/>
										{order.comment}
									</Card.Text>
								)}
							</Row>
						</Card.Body>
					</Card>
				</Col>
			)}
			<PaginationComponent
				currentPage={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				siblingCount={5}
			/>
		</Container>
	)
}

export default Order;
import {useCallback, useEffect, useState} from "react";
import {
	DeliveryMethodEnum,
	DeliveryStatusEnum,
	type OrderItem,
	type OrderResponse, OrderStatusEnum, PaymentMethodEnum,
	PaymentStatusEnum
} from "../api/order/types.ts";
import {getOrderByNumber, saveOrder} from "../api/order/api.ts";
import Cookies from "universal-cookie";
import {useParams} from "react-router-dom";
import Loading from "../components/Loading.tsx";
import {Col, Container, Row, Form, Table, Button, InputGroup} from "react-bootstrap";

const enumValues = <T extends Record<string, string>>(e: T) => Object.values(e) as Array<T[keyof T]>;

const toInputDateTime = (isoString: string | null | undefined) => {
	if (!isoString) return "";
	const d = new Date(isoString);
	if (Number.isNaN(d.getTime())) return "";
	// YYYY-MM-DDTHH:mm (local)
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

function Order() {

	const cookies = new Cookies();
	const { orderNumber } = useParams<{ orderNumber: string }>();

	const [loading, setLoading] = useState(true);
	const [buttonSaveLoading, setButtonSaveLoading] = useState(false);

	const [formState, setFormState] = useState<OrderResponse | null>(null);
	const [actionComment, setActionComment] = useState<string>("");

	const handleSave = useCallback(async () => {
		if (!orderNumber) return;

		setButtonSaveLoading(true);
		try {
			const act: string = cookies.get("act") || "";

			await saveOrder({
				orderNumber,
				guestName: formState?.guestName,
				guestPhone: formState?.guestPhone,
				guestEmail: formState?.guestEmail,
				address: formState?.address,
				deliveryMethod: formState?.deliveryMethod,
				deliveryPrice: formState?.deliveryPrice,
				deliveredAt: formState?.deliveredAt,
				deliveryStatus: formState?.deliveryStatus,
				trackingNumber: formState?.trackingNumber,
				paymentMethod: formState?.paymentMethod,
				discount: formState?.discount,
				paidAt: formState?.paidAt,
				paymentStatus: formState?.paymentStatus,
				transactionId: formState?.transactionId,
				systemComment: formState?.systemComment,
				comment: formState?.comment,
				status: formState?.status,
				profileId: formState?.profileId,
				actionComment,
				token: act,
			});

			alert("Данные обновлены");
			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
		}
		setButtonSaveLoading(false);
	}, [formState, actionComment]);

	const handleChange = <K extends keyof OrderResponse>(field: K, value: OrderResponse[K]) => {
		setFormState(prev => ({ ...prev, [field]: value } as OrderResponse));
	};

	const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
		const updatedItems = [...(formState?.items || [])];
		updatedItems[index] = { ...updatedItems[index], [field]: value } as OrderItem;
		setFormState(prev => ({ ...prev, items: updatedItems } as OrderResponse));
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = (formState?.items || []).filter((_, i) => i !== index);
		setFormState(prev => ({ ...prev, items: updatedItems } as OrderResponse));
	};

	useEffect(() => {
		async function getData() {
			try {
				const act: string = cookies.get("act");

				const response = await getOrderByNumber({orderNumber: orderNumber || "", token: act});

				setFormState(response);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}

		getData();
	}, []);

	if (loading) {
		return <Loading />;
	}

	return (
		<Container fluid>
			<div className="d-flex justify-content-between align-items-center mb-3 mt-3">
				<h3 className="mb-0">Заказ № {formState?.orderNumber}</h3>
			</div>

			{/* Контакты */}
			<Row>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Имя</Form.Label>
						<Form.Control
							value={formState?.guestName ?? ""}
							onChange={e => handleChange("guestName", (e.target.value || null) as any)}
						/>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Телефон</Form.Label>
						<Form.Control
							value={formState?.guestPhone ?? ""}
							onChange={e => handleChange("guestPhone", (e.target.value || null) as any)}
						/>
					</Form.Group>
				</Col>
			</Row>

			<Form.Group className="mb-3">
				<Form.Label>Email</Form.Label>
				<Form.Control
					value={formState?.guestEmail ?? ""}
					onChange={e => handleChange("guestEmail", (e.target.value || null) as any)}
				/>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Адрес</Form.Label>
				<Form.Control
					value={formState?.address ?? ""}
					onChange={e => handleChange("address", (e.target.value || null) as any)}
				/>
			</Form.Group>

			{/* ProfileId (nullable) */}
			<Form.Group className="mb-3">
				<Form.Label>Profile ID</Form.Label>
				<Form.Control
					value={(formState as any).profileId ?? ""}
					onChange={e => handleChange("profileId" as any, (e.target.value.trim() === "" ? null : e.target.value) as any)}
				/>
				<Form.Text>ID профиля клиента</Form.Text>
			</Form.Group>

			{/* Enum fields (nullable support) */}
			<Row>
				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Способ доставки</Form.Label>
						<Form.Select
							value={formState?.deliveryMethod ?? ""}
							onChange={e => handleChange("deliveryMethod", (e.target.value === "" ? null : e.target.value) as any)}
						>
							{enumValues(DeliveryMethodEnum).map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</Form.Select>
						<Form.Text>
							self_pickup - самовывоз<br/>
							delivery_moscow - доставка по Москве<br/>
							delivery_country - доставка по России (в регионы)
						</Form.Text>
					</Form.Group>
				</Col>

				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Статус доставки</Form.Label>
						<Form.Select
							value={formState?.deliveryStatus ?? ""}
							onChange={e => handleChange("deliveryStatus", (e.target.value === "" ? null : e.target.value) as any)}
						>
							<option value="">—</option>
							{enumValues(DeliveryStatusEnum).map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</Form.Select>
						<Form.Text>
							— - пустое поле<br/>
							pending - в обработке<br/>
							shipped - отправлено<br/>
							delivered - доставлено
						</Form.Text>
					</Form.Group>
				</Col>

				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Трек-номер посылки</Form.Label>
						<Form.Control
							value={formState?.trackingNumber ?? ""}
							onChange={e => handleChange("trackingNumber", (e.target.value.trim() === "" ? null : e.target.value) as any)}
						/>
					</Form.Group>
				</Col>
			</Row>

			<Row>
				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Способ оплаты</Form.Label>
						<Form.Select
							value={formState?.paymentMethod ?? ""}
							onChange={e => handleChange("paymentMethod", (e.target.value === "" ? null : e.target.value) as any)}
						>
							{enumValues(PaymentMethodEnum).map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</Form.Select>
						<Form.Text>
							cash_on_delivery - оплата наличными при получении заказа<br/>
							sbp - оплата по qr-коду через Систему Быстрых Платежей<br />
							bank_transfer - для юридических лиц, счёт выставляется после получения карточки организации
						</Form.Text>
					</Form.Group>
				</Col>

				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Статус оплаты</Form.Label>
						<Form.Select
							value={formState?.paymentStatus ?? ""}
							onChange={e => handleChange("paymentStatus", (e.target.value === "" ? null : e.target.value) as any)}
						>
							<option value="">—</option>
							{enumValues(PaymentStatusEnum).map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</Form.Select>
						<Form.Text>
							pending - платеж в обработке<br/>
							paid - успешно оплачено<br />
							failed - ошибка платежа<br />
							refunded - возврат средств
						</Form.Text>
					</Form.Group>
				</Col>

				<Col md={4}>
					<Form.Group className="mb-3">
						<Form.Label>Статус заказа</Form.Label>
						<Form.Select
							value={formState?.status ?? ""}
							onChange={e => handleChange("status", (e.target.value === "" ? null : e.target.value) as any)}
						>
							{enumValues(OrderStatusEnum).map(v => (
								<option key={v} value={v}>{v}</option>
							))}
						</Form.Select>
						<Form.Text>
							При переводе из (pending -{`>`} confirmed, confirmed -{`>`} completed) клиенту автоматически
							отправляется письмо на почту c уведомлением<br/>
							pending - ожидает обработки<br/>
							confirmed - принят<br />
							canceled - отменён<br />
							completed - завершён
						</Form.Text>
					</Form.Group>
				</Col>
			</Row>

			{/* Даты — с кнопкой очистки (чтобы гарантированно установить null) */}
			<Row>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Дата доставки</Form.Label>
						<InputGroup>
							<Form.Control
								type="datetime-local"
								value={toInputDateTime(formState?.deliveredAt as any)}
								onChange={e => handleChange("deliveredAt", (e.target.value === "" ? null : new Date(e.target.value).toISOString()) as any)}
							/>
							<Button variant="outline-secondary"
											onClick={() => handleChange("deliveredAt", null as any)}>Очистить</Button>
						</InputGroup>
					</Form.Group>
				</Col>

				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Дата оплаты</Form.Label>
						<InputGroup>
							<Form.Control
								type="datetime-local"
								value={toInputDateTime(formState?.paidAt as any)}
								onChange={e => handleChange("paidAt", (e.target.value === "" ? null : new Date(e.target.value).toISOString()) as any)}
							/>
							<Button variant="outline-secondary" onClick={() => handleChange("paidAt", null as any)}>Очистить</Button>
						</InputGroup>
					</Form.Group>
				</Col>
			</Row>

			{/* Prices / numbers (nullable support) */}
			<Row>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Стоимость доставки</Form.Label>
						<Form.Control
							type="number"
							value={formState?.deliveryPrice ?? ""}
							onChange={e => handleChange("deliveryPrice", (e.target.value === "" ? null : Number(e.target.value)) as any)}
						/>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group className="mb-3">
						<Form.Label>Скидка</Form.Label>
						<Form.Control
							type="number"
							value={formState?.discount ?? ""}
							onChange={e => handleChange("discount", (e.target.value === "" ? null : Number(e.target.value)) as any)}
						/>
						<Form.Text>
							Скидка заказа (промокод, акция и т.д.)
						</Form.Text>
					</Form.Group>
				</Col>
			</Row>

			{/* TransactionId */}
			<Form.Group className="mb-3">
				<Form.Label>Transaction ID</Form.Label>
				<Form.Control
					value={(formState as any).transactionId ?? ""}
					onChange={e => handleChange("transactionId" as any, (e.target.value.trim() === "" ? null : e.target.value) as any)}
				/>
				<Form.Text>
					ID записи транзакции в системе онлайн оплаты
				</Form.Text>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Комментарий</Form.Label>
				<Form.Control
					as="textarea"
					rows={2}
					value={formState?.comment ?? ""}
					onChange={e => handleChange("comment", (e.target.value.trim() === "" ? null : e.target.value) as any)}
				/>
				<Form.Text>
					Комментарий клиента
				</Form.Text>
			</Form.Group>

			<Form.Group className="mb-3">
				<Form.Label>Системный комментарий</Form.Label>
				<Form.Control
					as="textarea"
					rows={2}
					value={formState?.systemComment ?? ""}
					onChange={e => handleChange("systemComment", (e.target.value.trim() === "" ? null : e.target.value) as any)}
				/>
				<Form.Text>
					Комментарий от администратора для пользователя, например, как и где забрать заказ и т.п.
				</Form.Text>
			</Form.Group>

			{/* Items (edit + delete) */}
			<h4 className="mt-4">Товары</h4>
			<Table bordered hover size="sm">
				<thead>
				<tr>
					<th>Название</th>
					<th>Артикул</th>
					<th>Цена</th>
					<th>Кол-во</th>
					<th>ProductId</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{(formState?.items || []).map((item, idx) => (
					<tr key={idx}>
						<td>
							<Form.Control value={item.name ?? ""} onChange={e => handleItemChange(idx, "name", e.target.value)}/>
						</td>
						<td>
							<Form.Control value={item.article ?? ""}
														onChange={e => handleItemChange(idx, "article", e.target.value)}/>
						</td>
						<td>
							<Form.Control type="number" value={item.price ?? ""}
														onChange={e => handleItemChange(idx, "price", (e.target.value === "" ? null : Number(e.target.value)))}/>
						</td>
						<td>
							<Form.Control type="number" value={item.quantity ?? ""}
														onChange={e => handleItemChange(idx, "quantity", (e.target.value === "" ? null : Number(e.target.value)))}/>
						</td>
						<td>
							<Form.Control value={item.productId ?? ""}
														onChange={e => handleItemChange(idx, "productId", e.target.value)}/>
						</td>
						<td className="text-center">
							<Button variant="outline-danger" size="sm" onClick={() => handleRemoveItem(idx)}>Удалить</Button>
						</td>
					</tr>
				))}
				</tbody>
			</Table>

			{/* Activities (read-only) */}
			<h4 className="mt-4">История действий</h4>
			<Table bordered size="sm">
				<thead>
				<tr>
					<th>Комментарий</th>
					<th>Тип</th>
					<th>Актор</th>
					<th>Дата</th>
				</tr>
				</thead>
				<tbody>
				{(formState?.activities || []).map(act => (
					<tr key={act.id}>
						<td>{act.comment}</td>
						<td>{act.actionType}</td>
						<td>{act.actorType}</td>
						<td>
							{(new Date(act.createdAt)).toLocaleDateString("ru-RU", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
							})}
						</td>
					</tr>
				))}
				</tbody>
			</Table>

			{/* Comment + Save */}
			<Form.Group className="mb-3">
				<Form.Label>Комментарий к изменению</Form.Label>
				<Form.Control as="textarea" rows={3} value={actionComment} onChange={e => setActionComment(e.target.value)}/>
			</Form.Group>

			<div className="d-flex gap-2 mb-3">
				<Button
					variant="primary"
					onClick={handleSave}
					disabled={!actionComment.trim() || buttonSaveLoading}
				>
					{buttonSaveLoading ? "Загрузка..." : "Сохранить"}
				</Button>
				{!actionComment.trim() &&
            <div className="text-muted small align-self-center">Укажите комментарий, чтобы сохранить</div>}
			</div>
		</Container>
	)
}

export default Order;
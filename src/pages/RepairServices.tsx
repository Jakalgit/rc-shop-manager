import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import type {RepairServiceResponse} from "../api/repair-service/types.ts";
import {getServices, updateServices} from "../api/repair-service/repairServiceApi.ts";
import Cookies from "universal-cookie";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const RepairServices = () => {

	const cookies = new Cookies();
	const [loading, setLoading] = useState<boolean>(false);
	const [buttonLoading, setButtonLoading] = useState<boolean>(false);

	const [serviceItems, setServiceItems] = useState<RepairServiceResponse[]>([]);

	const changeService = (id: number, text: string) => {
		setServiceItems(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					service: text,
				}
			} else return el;
		}));
	}

	const changePrice = (id: number, text: string) => {
		setServiceItems(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					price: text,
				}
			} else return el;
		}));
	}

	const addService = () => {
		setServiceItems(prevState => [...prevState, {id: -Date.now(), service: "", price: ""}])
	}

	const deleteService = (id: number) => {
		setServiceItems(prevState => prevState.filter(el => el.id !== id))
	}

	const saveRepairServices = async () => {
		try {
			setButtonLoading(true);
			const act: string = cookies.get("act") || "";

			await updateServices({items: serviceItems.map(({id, ...rest}) => rest), act});

			alert("Услуги ремонта успешно обновлены");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setButtonLoading(false);
	}

	async function getData() {
		try {
			const response = await getServices();

			setServiceItems(response);
			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	useEffect(() => {
		getData();
	}, []);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Загрузка...</span>
			</Spinner>
		)
	}

	return (
		<Container fluid>
			<Row className="mb-3 mt-3">
				<Col lg={6}>
					<Button
						className="w-100"
						type="submit"
						variant="primary"
						onClick={addService}
					>
						Добавить
					</Button>
				</Col>
				<Col lg={6}>
					<Button
						className="w-100"
						type="submit"
						variant="primary"
						onClick={saveRepairServices}
					>
						{buttonLoading ? (
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Загрузка...</span>
							</Spinner>
						) : (
							<>Сохранить услуги</>
						)}
					</Button>
				</Col>
			</Row>
			{serviceItems.map(item =>
				<Row className="mt-4">
					<Form.Group className="mb-3" as={Col} lg="6">
						<Form.Label htmlFor="service">Услуга (id: {item.id})</Form.Label>
						<InputGroup>
							<Form.Control
								id="service"
								placeholder="Введите название услуги..."
								aria-label="Услуга"
								value={item.service}
								onChange={(e) => changeService(item.id, e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3" as={Col} lg="6">
						<Form.Label htmlFor="price">Цена</Form.Label>
						<InputGroup>
							<Form.Control
								id="price"
								placeholder="Введите цену услуги..."
								aria-label="Цена"
								value={item.price}
								onChange={(e) => changePrice(item.id, e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
					<Col>
						<Button
							className="w-100"
							type="submit"
							variant="danger"
							onClick={() => deleteService(item.id)}
						>
							Удалить
						</Button>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default RepairServices;
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import {getPageBlocks, updatePageBlocks} from "../api/page-block/api.ts";
import {PageEnum} from "../api/page-block/types.ts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export const DeliveryAndPayments = () => {

	const cookies = new Cookies();
	const [loading, setLoading] = useState<boolean>(false);
	const [buttonLoading, setButtonLoading] = useState<boolean>(false);

	const [blockItems, setBlockItems] = useState<{id: number, title: string, description: string}[]>([]);

	const changeTitle = (id: number, text: string) => {
		setBlockItems(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					title: text,
				}
			} else return el;
		}));
	}

	const changeDescription = (id: number, text: string) => {
		setBlockItems(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					description: text,
				}
			} else return el;
		}));
	}

	const addBlock = () => {
		setBlockItems(prevState => [...prevState, {id: -Date.now(), title: "", description: ""}])
	}

	const deleteBlock = (id: number) => {
		setBlockItems(prevState => prevState.filter(el => el.id !== id))
	}

	const savePageBlocks = async () => {
		if (blockItems.length === 0) {
			alert("Нужен как минимум 1 блок");
			return;
		}

		try {
			setButtonLoading(true);
			const act: string = cookies.get("act") || "";

			await updatePageBlocks({
				blocks: blockItems.map(el => ({title: el.title, description: el.description})),
				pageType: PageEnum.DELIVERY_AND_PAYMENTS,
				token: act,
			});

			alert("Блоки информации успешно сохранены");
			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setButtonLoading(false);
	}

	async function getData() {
		try {
			const response = await getPageBlocks(PageEnum.DELIVERY_AND_PAYMENTS);
			setBlockItems(response.map(el => {
				const {pageType, ...rest} = el;
				return rest;
			}));

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
						onClick={addBlock}
					>
						Добавить
					</Button>
				</Col>
				<Col lg={6}>
					<Button
						className="w-100"
						type="submit"
						variant="primary"
						onClick={savePageBlocks}
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
			{blockItems.map(item =>
				<Row className="mt-4">
					<Form.Group className="mb-3" as={Col} lg="12">
						<Form.Label htmlFor="title">Заголовок</Form.Label>
						<InputGroup>
							<Form.Control
								id="title"
								placeholder="Введите название блока..."
								aria-label="Заголовок"
								value={item.title}
								onChange={(e) => changeTitle(item.id, e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
					<Form.Group className="mb-3" as={Col} lg="12">
						<Form.Label htmlFor="decription">Описание</Form.Label>
						<InputGroup>
							<Form.Control
								as="textarea"
								rows={4}
								id="decription"
								placeholder="Введите описание блока"
								aria-label="Описание"
								value={item.description}
								onChange={(e) => changeDescription(item.id, e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
					<Col>
						<Button
							className="w-100"
							type="submit"
							variant="danger"
							onClick={() => deleteBlock(item.id)}
						>
							Удалить
						</Button>
					</Col>
				</Row>
			)}
		</Container>
	)
}
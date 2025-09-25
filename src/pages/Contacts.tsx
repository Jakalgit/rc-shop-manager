import React, {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import {getContacts, updateContacts} from "../api/contact/contactApi.ts";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const Contacts = () => {

	const cookies = new Cookies();

	const [loading, setLoading] = useState(false);
	const [loadingButton, setLoadingButton] = useState(false);

	const [address, setAddress] = useState<string>("");
	const [phone, setPhone] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [tgIdentifier, setTgIdentifier] = useState<string>("");
	const [whatsappIdentifier, setWhatsappIdentifier] = useState<string>("");
	const [workTime, setWorkTime] = useState<string>("");

	const inputBlocks = [
		{
			label: "Адрес",
			id: "address",
			value: address,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value),
			placeholder: "Введите адрес...",
		},
		{
			label: "Номер телефона",
			id: "phone",
			value: phone,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value),
			placeholder: "Номер телефона (+7XXXXXXXXXX)...",
			type: "phoneNumber"
		},
		{
			label: "Email",
			id: "email",
			value: email,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
			placeholder: "Введите email (example@mail.ru)...",
			type: "email"
		},
		{
			label: "Идентификатор Telegram",
			id: "telegramIdentifier",
			value: tgIdentifier,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTgIdentifier(e.target.value),
			placeholder: "Введите идентификатор (youridentifier, без @)",
		},
		{
			label: "Идентификатор What's App",
			id: "whatsappIdentifier",
			value: whatsappIdentifier,
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => setWhatsappIdentifier(e.target.value),
			placeholder: "Введите идентификатор (7XXXXXXXXXX)",
		},
	];

	// Обновление контактов
	const saveContacts = async () => {
		try {
			setLoadingButton(true);
			const act: string = cookies.get("act") || "";

			await updateContacts({phone, address, email, tgIdentifier, whatsappIdentifier, workTime, act});

			alert("Контакты успешно обновлены.");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setLoadingButton(false);
	}

	// Получение данных
	async function getData() {
		try {
			const response = await getContacts();

			setAddress(response.address);
			setPhone(response.phone);
			setEmail(response.email);
			setTgIdentifier(response.tgIdentifier);
			setWhatsappIdentifier(response.whatsappIdentifier);
			setWorkTime(response.workTime);

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
			<Row className="mt-4">
				{inputBlocks.map(item =>
					<Form.Group key={item.id} className="mb-4" as={Col} lg="12">
						<Form.Label htmlFor={item.id}>{item.label}</Form.Label>
						<InputGroup>
							<Form.Control
								id={item.id}
								placeholder={item.placeholder}
								aria-label={item.label}
								value={item.value}
								onChange={item.onChange}
								type={item.type || "text"}
							/>
						</InputGroup>
					</Form.Group>
				)}
				<Form.Group className="mb-4" as={Col} lg="12">
					<Form.Label htmlFor="workTime">Время работы</Form.Label>
					<InputGroup>
						<Form.Control
							as="textarea"
							id="workTime"
							rows={4}
							placeholder="Введите время работы в будние и выходные"
							aria-label="Время работы магазина"
							value={workTime}
							onChange={(e) => setWorkTime(e.target.value)}
						/>
					</InputGroup>
					<Form.Text>
						{"<strong></strong>"} - жирный текст<br/>
						{"<br/>"} - перенос строки
					</Form.Text>
				</Form.Group>
				<Col>
					<Button
						onClick={saveContacts}
						variant="primary"
						type="submit"
					>
						{loadingButton ? (
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Loading...</span>
							</Spinner>
						) : (
							<>Сохранить контакты</>
						)}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default Contacts;
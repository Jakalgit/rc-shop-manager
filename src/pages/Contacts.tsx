import {useEffect, useState} from "react";
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

	// Обновление контактов
	const saveContacts = async () => {
		try {
			setLoadingButton(true);
			const act: string = cookies.get("act") || "";

			await updateContacts({phone, address, email, act});

			alert("Successfully updated contacts");
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
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		)
	}

	return (
		<Container fluid>
			<Row>
				<Form.Group className="mb-4" as={Col} lg="12">
					<Form.Label htmlFor="address">Address</Form.Label>
					<InputGroup>
						<Form.Control
							id="address"
							placeholder="Input address..."
							aria-label="Address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Form.Group className="mb-4" as={Col} lg="12">
					<Form.Label htmlFor="phone">Phone</Form.Label>
					<InputGroup>
						<Form.Control
							id="phone"
							placeholder="Input phone (+7XXXXXXXXXX)..."
							aria-label="Phobe"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Form.Group className="mb-4" as={Col} lg="12">
					<Form.Label htmlFor="email">Email</Form.Label>
					<InputGroup>
						<Form.Control
							id="email"
							placeholder="Input email (example@mail.ru)..."
							aria-label="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</InputGroup>
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
							<>Save contacts</>
						)}
					</Button>
				</Col>
			</Row>
		</Container>
	);
};

export default Contacts;
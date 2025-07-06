import {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type {ProductResponse} from "../../api/product/types.ts";
import {getProductPagination} from "../../api/product/productApi.ts";
import Cookies from "universal-cookie";
import styles from "../../styles/components/AllProduct.module.css";
import {useNavigate} from "react-router-dom";
import PaginationComponent from "../PaginationComponent.tsx";

const AllProducts = () => {

	const cookies = new Cookies();
	const navigate = useNavigate();

	const [loading, setLoading] = useState(true);

	const [finderText, setFinderText] = useState("");
	const [totalPages, setTotalPages] = useState(1);
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<ProductResponse[]>([]);

	async function getData(finder?: string) {
		try {
			setLoading(true);
			const act: string = cookies.get("act") || "";

			const params = {
				page,
				limit: 24,
				...(finder ?{finder} : {})
			}

			const result = await getProductPagination(params, act);

			setTotalPages(result.totalPages);
			setItems(result.records);

			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	useEffect(() => {
		getData();
	}, [page]);

	const findProducts = async () => {
		if (finderText.length > 0 && !loading) {
			await getData(finderText);
		}
	}

	const openProductPage = (id: number) => {
		navigate(`/product/${id}`);
	}

	return (
		<Container fluid>
			<Row>
				<Form.Group as={Col} lg="12">
					<Form.Label htmlFor="finder">Find product</Form.Label>
					<InputGroup>
						<Form.Control
							id="finder"
							placeholder="Input text..."
							aria-label="Product finder"
							value={finderText}
							onChange={(e) => setFinderText(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Col className="mt-2">
					<Button
						onClick={findProducts}
						variant="primary"
					>
						Find
					</Button>
				</Col>
			</Row>
			<Row className="mt-4">
				{items.map((item, index) =>
					<Col key={index} className="mt-3" lg={3}>
						<Card className="h-100">
							<Card.Img
								className={styles.img}
								src={`${import.meta.env.VITE_CLOUD_URL}/${item.images[0].filename}`}
								variant="top"
							/>
							<Card.Body>
								<Card.Title style={{ fontSize: 18 }}>
									{item.article}
								</Card.Title>
								<Card.Text style={{ fontSize: 14 }}>
									Name: {item.name}
								</Card.Text>
								<Button onClick={() => openProductPage(item.id)} variant="primary">Change info</Button>
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
		</Container>
	);
};

export default AllProducts;
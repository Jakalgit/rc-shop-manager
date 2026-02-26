import React, {type ComponentProps, useEffect, useState} from "react";
import {Button, Card, Col, Modal} from "react-bootstrap";
import styles from './CopyProductPopup.module.css';
import Cookies from "universal-cookie";
import type {ProductResponse} from "../../../api/product/types.ts";
import {getProductPagination} from "../../../api/product/productApi.ts";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import PaginationComponent from "../../../components/PaginationComponent.tsx";


interface CopyProductPopupProps {
	modalAttrs?: ComponentProps<typeof Modal>;
	setCopiedProduct: (product: ProductResponse) => void;
}

export const CopyProductPopup: React.FC<CopyProductPopupProps> = React.memo(({ modalAttrs, setCopiedProduct }) => {

	const cookies = new Cookies();

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
				limit: 12,
				...(finder ? {finder} : {})
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
		if (modalAttrs?.show) {
			getData();
		}
	}, [page, modalAttrs?.show]);

	useEffect(() => {
		if (!modalAttrs?.show) {
			setFinderText("");
		}
	}, [modalAttrs?.show]);

	const findProducts = React.useCallback(async () => {
		if (finderText.length > 0 && !loading) {
			await getData(finderText);
		}
	}, [finderText, loading, getData]);

	const handleClickCopy = React.useCallback((item: ProductResponse) => {
		setCopiedProduct(item);

		if (modalAttrs?.onHide) {
			modalAttrs.onHide()
		}
	}, [modalAttrs]);

	return (
		<Modal
			{...modalAttrs}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Копировать продукт
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="align-items-end">
					<Form.Group as={Col} lg="10">
						<Form.Label htmlFor="finder">Поиск по продуктам</Form.Label>
						<InputGroup>
							<Form.Control
								id="finder"
								placeholder="Введите текст..."
								aria-label="Поиск по продуктам"
								value={finderText}
								onChange={(e) => setFinderText(e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
					<Col lg={2}>
						<Button
							className="w-100"
							onClick={findProducts}
							variant="primary"
						>
							Найти
						</Button>
					</Col>
				</Row>
				<Row className={` ${styles.products}`}>
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
										Название: {item.name}
									</Card.Text>
									<Button
										variant="primary"
										onClick={() => handleClickCopy(item)}
									>
										Копировать
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
			</Modal.Body>
		</Modal>
	)
})
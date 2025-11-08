import React, {useCallback, useEffect} from "react";
import {Accordion, Button, Card, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import type {ProductGroup} from "../../api/product-group/types.ts";
import Cookies from "universal-cookie";
import {getProductGroup, getProductGroups} from "../../api/product-group/api.ts";
import PaginationComponent from "../PaginationComponent.tsx";


interface ProductGroupsListProps {
	productGroupId: number | null;
	setProductGroupId: (value: number | null) => void;
}

export const ProductGroupsAccordion: React.FC<ProductGroupsListProps> = React.memo(({ productGroupId, setProductGroupId }) => {

	const cookies = new Cookies();

	const [finder, setFinder] = React.useState<string>('');
	const [groups, setGroups] = React.useState<ProductGroup[]>([]);
	const [page, setPage] = React.useState<number>(1);
	const [totalPages, setTotalPages] = React.useState<number>(1);
	const [productName, setProductName] = React.useState<string>('');

	const handleClickFind = useCallback(() => {
		getData();
	}, [finder]);

	const handleClickSelectGroup = useCallback((group: ProductGroup | null) => {
		setProductGroupId(group?.id || null);
		setProductName(group?.name || '');
	}, [setProductName, setProductGroupId])

	async function getData() {
		try {
			const act = cookies.get('act') || '';

			const response = await getProductGroups({ page, pageCount: 6, finder, token: act });

			setGroups(response.records);
			setTotalPages(response.totalPages);
		} catch (e: any) {
			alert(e.response?.data?.message);
		}
	}

	async function getCurrentProductGroup() {
		if (!productGroupId) return;

		try {
			console.log('weofijweojifojiew');

			const act = cookies.get('act') || '';

			const response = await getProductGroup({id: productGroupId, token: act });

			setProductName(response.name);
		} catch (e: any) {
			alert(e.response?.data?.message);
		}
	}

	useEffect(() => {
		getData();
	}, [])

	useEffect(() => {
		getCurrentProductGroup();
	}, [productGroupId]);

	useEffect(() => {
		if (finder.length === 0) {
			getData();
		}
	}, [finder]);

	return (
		<>
			<Accordion.Header>
				Продуктовая группа ({productGroupId === null ? 'Не выбрано' : `${productName}`})
			</Accordion.Header>
			<Accordion.Body>
				<Form.Group as={Col} lg="12">
					<Form.Label htmlFor="finder">Поиск по группам</Form.Label>
					<InputGroup>
						<Form.Control
							id="finder"
							placeholder="Введите текст..."
							aria-label="Поиск по группам"
							value={finder}
							onChange={(e) => setFinder(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Row className="mt-2">
					<Col md={3}>
						<Button
							onClick={handleClickFind}
							className="w-100"
							variant="primary"
						>
							Найти
						</Button>
					</Col>
					<Col md={3}>
						<Button
							onClick={() => setProductGroupId(null)}
							className="w-100"
							variant="primary"
						>
							Отменить выбор
						</Button>
					</Col>
				</Row>
				<div>
					{groups.map((group, index) =>
						<Col
							key={index}
							className="mt-3"
							md={12}
						>
							<Card className="w-100">
								<Card.Body>
									<Card.Title>
										<strong>Название:</strong> {group.name}
									</Card.Title>
									<Card.Text>
										<strong>ID:</strong> {group.id}
									</Card.Text>
									<Row className="mt-4">
										<Col md={2}>
											<Button
												onClick={() => handleClickSelectGroup(group)}
												className="w-100"
												variant="danger"
											>
												Выбрать
											</Button>
										</Col>
									</Row>
								</Card.Body>
							</Card>
						</Col>
					)}
				</div>
				<PaginationComponent
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
					siblingCount={5}
				/>
			</Accordion.Body>
		</>
	)
})
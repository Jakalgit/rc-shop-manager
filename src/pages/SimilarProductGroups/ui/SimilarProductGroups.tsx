import React, {useCallback, useEffect, useMemo} from "react";
import {Button, Col, Container, Row} from "react-bootstrap";
import type {ProductGroup} from "../../../api/product-group/types.ts";
import Cookies from "universal-cookie";
import {useSearchParams} from "react-router-dom";
import {deleteProductGroup, getProductGroups} from "../../../api/product-group/api.ts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {ProductGroupBlock} from "../widgets/ProductGroupBlock";
import PaginationComponent from "../../../components/PaginationComponent.tsx";


export const SimilarProductGroups = React.memo(() => {

	const cookies = new Cookies();

	const [searchParams, setSearchParams] = useSearchParams();
	const page = Number(searchParams.get('page') || 1);
	const finder = searchParams.get('finder') || '';

	const [initialGroups, setInitialGroups] = React.useState<ProductGroup[]>([]);
	const [groups, setGroups] = React.useState<ProductGroup[]>([]);

	const [loading, setLoading] = React.useState<boolean>(true);
	const [totalPages, setTotalPages] = React.useState<number>(1);
	const [finderText, setFinderText] = React.useState<string>('');

	const compareFields: (keyof ProductGroup)[] = useMemo(() => {
		return [
			'name'
		]
	}, []);

	const handleClickFind = useCallback(async () => {
		searchParams.delete('page');
		searchParams.set('finder', finderText);

		setSearchParams(searchParams);

		await getData();
	}, [finderText, searchParams, setSearchParams]);

	const updateProductGroupField = useCallback((id: number, field: keyof ProductGroup, value: ProductGroup[keyof ProductGroup]) => {
		setGroups(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					[field]: value
				}
			} else return el;
		}))
	}, []);

	const dropProductGroup = useCallback(async (id: number) => {
		const act = cookies.get("act") || "";

		const current = groups.find(el => el.id === id);

		if (!window.confirm(`Вы уверены что хотите удалить группу: ${current?.name}`)) {
			return;
		}

		try {
			if (id >= 0) {
				await deleteProductGroup(id, act);
				alert('Группа успешно удалена');

				searchParams.delete('page');
				setSearchParams(searchParams);

				getData();
			} else {
				setGroups(prevState => prevState.filter(el => el.id !== id));
				setInitialGroups(prevState => prevState.filter(el => el.id !== id));
			}
		} catch (e: any) {
			alert(e.response?.data?.message);
		}
	}, [searchParams, setSearchParams, setGroups, setInitialGroups, groups]);

	const addNewGroup = useCallback(() => {
		setGroups(prevState => [{id: -Date.now(), name: 'Название новой группы'}, ...prevState]);
	}, [setGroups]);

	const onPageChange = useCallback((page: number) => {
		searchParams.set('page', String(page));
	}, [searchParams, setSearchParams]);

	async function getData() {
		try {
			const act = cookies.get("act") || "";

			const response = await getProductGroups({ page, pageCount: 15, finder, token: act });

			setInitialGroups(response.records);
			setGroups(response.records);
			setTotalPages(response.totalPages);

			setLoading(false);
		} catch (e: any) {
			alert(e.response?.data?.message);
		}
	}

	useEffect(() => {
		getData();
	}, []);

	if (loading) return null;

	return (
		<Container fluid>
			<Row className="mt-4">
				<Form.Group as={Col} lg="12">
					<Form.Label htmlFor="finder">Поиск по группам</Form.Label>
					<InputGroup>
						<Form.Control
							id="finder"
							placeholder="Введите текст..."
							aria-label="Поиск по группам"
							value={finderText}
							onChange={(e) => setFinderText(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Row className="mt-2">
					<Col md={3}>
						<Button
							className="w-100"
							onClick={handleClickFind}
							variant="primary"
						>
							Найти
						</Button>
					</Col>
					<Col md={3}>
						<Button
							className="w-100"
							onClick={addNewGroup}
							variant="primary"
						>
							Добавить группу
						</Button>
					</Col>
				</Row>
			</Row>
			<div className="w-100 overflow-y-auto">
				{groups.map((group, i) =>
					<ProductGroupBlock
						key={i}
						compareFields={compareFields}
						current={group}
						initial={initialGroups.find(el => el.id === group.id)}
						dropProductGroup={dropProductGroup}
						getData={getData}
						setCurrent={
							(field: keyof ProductGroup, value: ProductGroup[keyof ProductGroup]) =>
								updateProductGroupField(group.id, field, value)
						}
					/>
				)}
			</div>
			<PaginationComponent
				currentPage={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
				siblingCount={5}
			/>
		</Container>
	)
})
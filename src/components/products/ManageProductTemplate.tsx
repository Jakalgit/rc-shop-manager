import {Accordion, Button, Col, Row, Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {isNumeric} from "../../functions/isNumeric.ts";
import {DetailEnum} from "../../api/product/types.ts";
import ImageSelector from "./image-selector/ImageSelector.tsx";
import React, {useEffect, useState} from "react";
import type {TagResponse} from "../../api/tag/types.ts";

export interface ISaveProductArguments {
	id?: number,
	name: string,
	availability: boolean,
	visibility: boolean,
	count: number,
	price: string,
	wholesalePrice: string,
	article: string,
	oldPrice: string,
	promotionPercentage: string,
	width: string,
	height: string,
	length: string,
	weight: string,
	details: {id: number, text: string, detailType: DetailEnum}[],
	previews: {imageId?: number, filename: string}[],
	files: File[],
	selectedTags: TagResponse[],
}

export type GetDataProps = {
	setAllTags:  (value: React.SetStateAction<TagResponse[]>) => void;
	setFinderTags: (value: React.SetStateAction<TagResponse[]>) => void;
	setName: (value: React.SetStateAction<string>) => void;
	setPrice: (value: React.SetStateAction<string>) => void;
	setWholesalePrice: (value: React.SetStateAction<string>) => void;
	setArticle: (value: React.SetStateAction<string>) => void;
	setCount: (value: React.SetStateAction<number>) => void;
	setOldPrice: (value: React.SetStateAction<string>) => void;
	setPromotionPercentage: (value: React.SetStateAction<string>) => void;
	setWidth: (value: React.SetStateAction<string>) => void;
	setHeight: (value: React.SetStateAction<string>) => void;
	setLength: (value: React.SetStateAction<string>) => void;
	setWeight: (value: React.SetStateAction<string>) => void;
	setDetails: (value: React.SetStateAction<{id: number; text: string; detailType: DetailEnum }[]>) => void;
	setSelectedTags: (value: React.SetStateAction<TagResponse[]>) => void;
	setPreviews: (value: React.SetStateAction<{imageId?: number; filename: string}[]>) => void;
}

interface IProps {
	saveProductInDatabase: (props: ISaveProductArguments) => void;
	getData: (props: GetDataProps) => Promise<void>;
	loadingSaveButton: boolean;
	id?: number
}

const ManageProductTemplate: React.FC<IProps> = ({ saveProductInDatabase, loadingSaveButton, id, getData }) => {

	const [loading, setLoading] = useState(false);

	const [previews, setPreviews] = useState<{imageId?: number, filename: string}[]>([]);
	const [files, setFiles] = useState<File[]>([]);

	const [allTags, setAllTags] = useState<TagResponse[]>([]);
	const [selectedTags, setSelectedTags] = useState<TagResponse[]>([]);
	const [finderTags, setFinderTags] = useState<TagResponse[]>([]);
	const [finderTagsText, setFinderTagsText] = useState<string>("");

	const [name, setName] = useState<string>('');
	const [price, setPrice] = useState<string>('');
	const [wholesalePrice, setWholesalePrice] = useState<string>('');
	const [article, setArticle] = useState<string>('');

	const [availability, setAvailability] = useState<boolean>(true);
	const [visibility, setVisibility] = useState<boolean>(true);
	const [count, setCount] = useState<number>(0);

	const [oldPrice, setOldPrice] = useState<string>('');
	const [promotionPercentage, setPromotionPercentage] = useState<string>('');

	const [height, setHeight] = useState<string>('');
	const [weight, setWeight] = useState<string>('');
	const [width, setWidth] = useState<string>('');
	const [length, setLength] = useState<string>('');

	const [details, setDetails] = useState<{id: number, text: string, detailType: DetailEnum}[]>([]);

	// Добавление описания
	const addDetail = (detailType: DetailEnum) => {
		setDetails(prevState => [...prevState, {id: -Date.now(), text: "", detailType}]);
	}

	// Удаление описания
	const deleteDetail = (id: number) => {
		setDetails(prevState => prevState.filter(el => el.id !== id));
	}

	// Изменение текста описания
	const changeDetailText = (id: number, text: string) => {
		setDetails(prevState => prevState.map(el => {
			if (el.id === id) {
				return {...el, text}
			} else return el;
		}));
	}

	// Добавление тега в выбранные
	const selectTag = (id: number) => {
		const tag = allTags.find((tag) => tag.id === id);
		const selectedTag = selectedTags.find((tag) => tag.id === id);
		if (tag && !selectedTag) {
			setSelectedTags(prevState => [...prevState, tag]);
		}
	}

	// Удаление тега из выбранных
	const deleteTag = (id: number) => {
		setSelectedTags(prevState => prevState.filter(el => el.id !== id));
	}

	const save = async () => {
		saveProductInDatabase({
			id, name, availability, visibility, count, price, article, oldPrice, promotionPercentage,
			details, previews, files, selectedTags, width, height, length, weight, wholesalePrice
		});
	}

	const fetchData = async () => {
		getData({
			setAllTags, setFinderTags, setName, setPrice, setArticle, setCount, setOldPrice, setPromotionPercentage,
			setWidth, setHeight, setLength, setWeight, setDetails, setPreviews, setSelectedTags, setWholesalePrice
		}).then(() => setLoading(false));
	}

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (isNumeric(promotionPercentage) && Number(price)) {
			const valuePromotionPercentage = Number(promotionPercentage);
			const valuePrice = Number(price);
			const result = Math.max(valuePrice / (1 - (valuePromotionPercentage / 100)), valuePrice);
			setOldPrice(result.toFixed(2));
		}
	}, [promotionPercentage]);

	// Обновляем массив найденных тегов при изменении строки запроса
	useEffect(() => {
		if (finderTagsText.length === 0) {
			setFinderTags(allTags);
		} else {
			setFinderTags(
				allTags.filter(tag => tag.name.toLowerCase().includes(finderTagsText.toLowerCase()))
			);
		}
	}, [finderTagsText]);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Загрузка...</span>
			</Spinner>
		)
	}

	return (
		<>
			<Row>
				<Button
					className="mb-4"
					type="submit"
					variant="warning"
					disabled={loadingSaveButton}
					onClick={save}
				>
					{loadingSaveButton ? (
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Загрузка...</span>
						</Spinner>
					) : (
						<>Сохранить товар в базе данных</>
					)}
				</Button>
			</Row>
			<Row className="mb-4">
				<Form.Group as={Col} lg="6">
					<Form.Label htmlFor="name">Название товара*</Form.Label>
					<InputGroup>
						<Form.Control
							id="name"
							placeholder="Название*"
							aria-label="Название товара"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Form.Group as={Col} lg="6">
					<Form.Label htmlFor="article">Артикул товара*</Form.Label>
					<InputGroup>
						<Form.Control
							id="article"
							placeholder="Артикул*"
							aria-label="Артикул"
							value={article}
							onChange={(e) => setArticle(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
			</Row>
			<Row className="mb-4">
				<Form.Group as={Col} lg="6">
					<Form.Label htmlFor="price">Цена товара (RUB)*</Form.Label>
					<InputGroup>
						<Form.Control
							id="price"
							type="number"
							placeholder="Цена*"
							aria-label="Цена товара"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
				<Form.Group as={Col} lg="6">
					<Form.Label htmlFor="wholesalePrice">Оптовая цена товара (RUB)*</Form.Label>
					<InputGroup>
						<Form.Control
							id="wholesalePrice"
							type="number"
							placeholder="Оптовая цена*"
							aria-label="Оптовая цена товара"
							value={wholesalePrice}
							onChange={(e) => setWholesalePrice(e.target.value)}
						/>
					</InputGroup>
				</Form.Group>
			</Row>
			<Row className="mb-4">
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Теги ({selectedTags.length} элементов выбрано)</Accordion.Header>
						<Accordion.Body>
							<Row>
								<InputGroup className="mb-3">
									<Form.Control
										type="text"
										placeholder="Название тега..."
										aria-label="Поиск по тегам"
										value={finderTagsText}
										onChange={(e) => setFinderTagsText(e.target.value)}
									/>
								</InputGroup>
							</Row>
							<Row>
								<Col lg={6}>
									<Form.Label>Список доступных тегов</Form.Label>
									<div style={{ overflow: 'auto', height: '200px' }}>
										<div className="d-flex flex-wrap gap-2">
											{finderTags.map((tag, index) => (
												<Button
													onClick={() => selectTag(tag.id)}
													key={index}
													variant="outline-primary"
													size="sm"
												>
													{tag.name}
												</Button>
											))}
										</div>
									</div>
								</Col>
								<Col lg={6}>
									<Form.Label>Список выбранных</Form.Label>
									<div style={{ overflow: 'auto', height: '200px' }}>
										<div className="d-flex flex-wrap gap-2">
											{selectedTags.map((tag, index) => (
												<Button
													onClick={() => deleteTag(tag.id)}
													key={index}
													variant="outline-danger"
													size="sm"
												>
													{tag.name}
												</Button>
											))}
										</div>
									</div>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Row>
			<Row className="mb-4">
				<Form.Group as={Col} lg="4">
					<Form.Label htmlFor="availability-status">Доступность*</Form.Label>
					<Form.Select
						aria-label="Статус доступности"
						name="availability"
						id="availability-status"
						onChange={(e) => setAvailability(e.target.value === "1")}
						value={availability ? "1" : "2"}
					>
						<option value="1">В наличии</option>
						<option value="2">Нет в наличии</option>
					</Form.Select>
				</Form.Group>
				<Form.Group as={Col} lg="4">
					<Form.Label htmlFor="count">Кол-во товаров*</Form.Label>
					<InputGroup>
						<Form.Control
							id="count"
							placeholder="Количество*"
							aria-label="Количство товаров"
							value={count}
							onChange={(e) => setCount(Number(e.target.value))}
						/>
					</InputGroup>
				</Form.Group>
				<Form.Group as={Col} lg="4">
					<Form.Label htmlFor="visibility-status">Видимость пользователю*</Form.Label>
					<Form.Select
						aria-label="Статус видимости"
						name="visibility"
						id="visibility-status"
						onChange={(e) => setVisibility(e.target.value === "1")}
						value={visibility ? "1" : "2"}
					>
						<option value="1">Видимый</option>
						<option value="2">Невидимый</option>
					</Form.Select>
				</Form.Group>
			</Row>
			<Row className="mb-4">
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Скидка на товар ({isNumeric(oldPrice) ? 'Активна' : 'Неактивна'})</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Form.Group as={Col} lg="6">
									<Form.Label htmlFor="oldPrice">Цена до скидки</Form.Label>
									<InputGroup>
										<Form.Control
											id="oldPrice"
											placeholder="Цена до скидки"
											aria-label="Цена продукта до скидки"
											value={oldPrice}
											onChange={(e) => setOldPrice(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Form.Group as={Col} lg="6">
									<Form.Label htmlFor="percentage">Процент скидки</Form.Label>
									<InputGroup>
										<Form.Control
											id="percentage"
											placeholder="Процент скидки"
											aria-label="Процент скидки"
											value={promotionPercentage}
											onChange={(e) => setPromotionPercentage(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>Физические характеристики (килограммы, метры)</Accordion.Header>
						<Accordion.Body>
							<Row>
								<Form.Group as={Col} lg="3">
									<Form.Label htmlFor="width">Ширина</Form.Label>
									<InputGroup>
										<Form.Control
											id="width"
											placeholder="Ширина, м."
											aria-label="Ширина товара"
											value={width}
											onChange={(e) => setWidth(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Form.Group as={Col} lg="3">
									<Form.Label htmlFor="height">Высота</Form.Label>
									<InputGroup>
										<Form.Control
											id="height"
											placeholder="Высота, м."
											aria-label="Высота товара"
											value={height}
											onChange={(e) => setHeight(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Form.Group as={Col} lg="3">
									<Form.Label htmlFor="lenght">Длина</Form.Label>
									<InputGroup>
										<Form.Control
											id="lenght"
											placeholder="Длина, м."
											aria-label="Длина товара"
											value={length}
											onChange={(e) => setLength(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Form.Group as={Col} lg="3">
									<Form.Label htmlFor="weight">Вес</Form.Label>
									<InputGroup>
										<Form.Control
											id="weight"
											placeholder="Вес, кг."
											aria-label="Вес товара"
											value={weight}
											onChange={(e) => setWeight(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Row>
			<Row className="mb-4">
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>
							Описания ({details.filter(el => el.detailType === DetailEnum.DESCRIPTION).length} элементов)
						</Accordion.Header>
						<Accordion.Body>
							<Button
								onClick={() => addDetail(DetailEnum.DESCRIPTION)}
								variant="primary"
								type="submit"
								className="mb-4"
							>
								Добавить описание
							</Button>
							{details.filter(el => el.detailType === DetailEnum.DESCRIPTION).map(el =>
								<Form.Group key={el.id} className="mb-3" controlId={`description.ControlTextarea${el.id}`}>
									<Form.Label>Описание (id: {el.id})</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										value={el.text}
										onChange={(e) => changeDetailText(el.id, e.target.value)}
										placeholder="Введите текст*"
									/>
									<Button
										variant="danger"
										type="submit"
										className="mt-2"
										onClick={() => deleteDetail(el.id)}
									>
										Удалить
									</Button>
								</Form.Group>
							)}
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>
							Спецификации ({details.filter(el => el.detailType === DetailEnum.SPECIFICATION).length} элементов)
						</Accordion.Header>
						<Accordion.Body>
							<Button
								onClick={() => addDetail(DetailEnum.SPECIFICATION)}
								variant="primary"
								type="submit"
								className="mb-4"
							>
								Добавить спецификацию
							</Button>
							{details.filter(el => el.detailType === DetailEnum.SPECIFICATION).map(el =>
								<Form.Group key={el.id} className="mb-3" controlId={`specification.ControlTextarea${el.id}`}>
									<Form.Label>Спецификация (id: {el.id})</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										value={el.text}
										onChange={(e) => changeDetailText(el.id, e.target.value)}
										placeholder="Введите текст*"
									/>
									<Button
										variant="danger"
										type="submit"
										className="mt-2"
										onClick={() => deleteDetail(el.id)}
									>
										Удалить
									</Button>
								</Form.Group>
							)}
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>
							Комплектация ({details.filter(el => el.detailType === DetailEnum.EQUIPMENT).length} items)
						</Accordion.Header>
						<Accordion.Body>
							<Button
								onClick={() => addDetail(DetailEnum.EQUIPMENT)}
								variant="primary"
								type="submit"
								className="mb-4"
							>
								Добавить в комплект
							</Button>
							{details.filter(el => el.detailType === DetailEnum.EQUIPMENT).map(el =>
								<Form.Group key={el.id} className="mb-3" controlId={`equipment.ControlTextarea${el.id}`}>
									<Form.Label>Позиция комплекта (id: {el.id})</Form.Label>
									<Form.Control
										as="textarea"
										rows={3}
										value={el.text}
										onChange={(e) => changeDetailText(el.id, e.target.value)}
										placeholder="Введите текст*"
									/>
									<Button
										variant="danger"
										type="submit"
										className="mt-2"
										onClick={() => deleteDetail(el.id)}
									>
										Удалить
									</Button>
								</Form.Group>
							)}
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Row>
			<Row>
				<ImageSelector
					previews={previews}
					files={files}
					setPreviews={setPreviews}
					setFiles={setFiles}
				/>
			</Row>
		</>
	);
};

export default ManageProductTemplate;
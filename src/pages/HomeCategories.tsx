import Cookies from "universal-cookie";
import {type ChangeEvent, useEffect, useRef, useState} from "react";
import type {HomeCategoryResponse} from "../api/home-category/types.ts";
import {createHomeCategory, deleteHomeCategory, getHomeCategories} from "../api/home-category/homeCatogoryApi.ts";
import {Accordion, Button, Card, Col, Container, Image, Row, Spinner} from "react-bootstrap";
import stylesProducts from "../styles/components/AllProduct.module.css";
import {getAllGroups} from "../api/tag/tagApi.ts";
import type {GroupResponse} from "../api/tag/types.ts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const HomeCategories = () => {

	const cookies = new Cookies();
	const inputFileRef = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState(true);

	const [homeCategories, setHomeCategories] = useState<HomeCategoryResponse[]>([]);

	const [groups, setGroups] = useState<GroupResponse[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([]);
	const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

	const [finderGroups, setFinderGroups] = useState<string>("");

	const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(undefined);

	const createNewHomeCategory = async () => {
		if (currentGroupId && selectedFile) {
			try {
				const act: string = cookies.get("act") || "";

				const formData = new FormData();

				formData.append("groupId", String(currentGroupId));
				formData.append("image", selectedFile);

				await createHomeCategory({formData, act});
				await getData();

				setSelectedFile(undefined);
				setCurrentGroupId(undefined);

				alert("Successfully created!");
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
			}
		}
	}

	const deleteCurrentHomeCategory = async (id: number) => {
		try {
			const act: string = cookies.get("act") || "";

			await deleteHomeCategory({id, act});
			await getData();

			alert("Successfully deleted!");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files);
		setSelectedFile(newFiles[0]);
		e.target.value = '';
	};

	// Получение данных
	async function getData() {
		try {
			const act: string = cookies.get("act") || "";

			const [responseCategories, responseGroups] = await Promise.all([
				getHomeCategories(),
				getAllGroups(act),
			]);

			setHomeCategories(responseCategories);

			setGroups(responseGroups);
			setFilteredGroups(responseGroups);

			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	useEffect(() => {
		getData();
	}, []);

	// Обновляем массив найденных групп при изменении строки запроса
	useEffect(() => {
		if (finderGroups.length === 0) {
			setFilteredGroups(groups);
		} else {
			setFilteredGroups(
				groups.filter(group => group.name.toLowerCase().includes(finderGroups.toLowerCase()))
			);
		}
	}, [finderGroups]);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		)
	}

	return (
		<Container fluid>
			<Row className="mt-4">
				<Accordion>
					<Accordion.Item eventKey="0">
						<Accordion.Header>Create new home category</Accordion.Header>
						<Accordion.Body>
							<Row className="mt-3">
								<Col lg={2}>
									<Button
										onClick={createNewHomeCategory}
										variant="primary"
									>
										Add home category
									</Button>
								</Col>
							</Row>
							<Row className="mt-4">
								<Col>
									<Button
										variant="primary"
										onClick={handleAddClick}
										className="mb-2"
									>
										Select new image
									</Button>
									<input
										type="file"
										accept="image/*"
										multiple
										ref={inputFileRef}
										onChange={handleFilesChange}
										style={{display: 'none'}}
									/>
									{selectedFile && (
										<Image
											src={URL.createObjectURL(selectedFile)}
											alt={selectedFile.name}
											rounded
											style={{
												maxHeight: 150,
												width: 'auto',
												marginLeft: 10,
												objectFit: 'contain',
											}}
										/>
									)}
								</Col>
							</Row>
							<Row className="mt-2">
								<Form.Group as={Col} lg="10">
									<Form.Label htmlFor="finder">Finder</Form.Label>
									<InputGroup>
										<Form.Control
											id="finder"
											placeholder="Group name"
											aria-label="Group name"
											value={finderGroups}
											onChange={(e) => setFinderGroups(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
							</Row>
							<Row className="mt-3">
								<Col lg={12}>
									<Form.Label>List of groups</Form.Label>
									<div style={{ overflow: 'auto', height: '150px' }}>
										<div className="d-flex flex-wrap gap-2">
											{filteredGroups.map((group, index) => (
												<Button
													onClick={() => setCurrentGroupId(group.id)}
													key={index}
													variant={currentGroupId === group.id ? "primary" : "outline-primary"}
													size="sm"
												>
													{group.name}
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
			<Row>
				{homeCategories.map((item, index) =>
					<Col key={index} className="mt-3" lg={3}>
						<Card className="h-100">
							<Card.Img
								className={stylesProducts.img}
								src={`${import.meta.env.VITE_CLOUD_URL}/${item.image}`}
								variant="top"
							/>
							<Card.Body>
								<Card.Title>
									{item.name}
								</Card.Title>
								<Button
									className="mt-3"
									onClick={() => deleteCurrentHomeCategory(item.id)}
									variant="primary"
								>
									Delete group
								</Button>
							</Card.Body>
						</Card>
					</Col>
				)}
			</Row>
		</Container>
	);
};

export default HomeCategories;
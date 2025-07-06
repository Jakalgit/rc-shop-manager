import {Accordion, Button, Col, Row, Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {useEffect, useState} from "react";
import {createNewTag, deleteTag, getAllGroups, getAllTags, updateTag} from "../../api/tag/tagApi.ts";
import Cookies from "universal-cookie";
import type {GroupResponse, TagResponse} from "../../api/tag/types.ts";

const ManageTags = () => {

	const cookies = new Cookies();
	const [newTagButtonLoading, setNewTagButtonLoading] = useState(false);
	const [saveTagButtonLoading, setSaveTagButtonLoading] = useState(false);
	const [deleteTagButtonLoading, setDeleteTagButtonLoading] = useState(false);
	const [loading, setLoading] = useState(false);

	const [newTagName, setNewTagName] = useState<string>("");
	const [updateTagName, setUpdateTagName] = useState<string>("");

	const [currentTagId, setCurrentTagId] = useState<number | undefined>(undefined);
	const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(undefined);

	const [allTags, setAllTags] = useState<TagResponse[]>([]);
	const [filteredTags, setFilteredTags] = useState<TagResponse[]>([]);

	const [allGroups, setAllGroups] = useState<GroupResponse[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([]);

	const [finderTagText, setFinderTagText] = useState<string>("");
	const [finderGroupText, setFinderGroupText] = useState<string>("");

	// Создание нового тега
	const createTag = async () => {
		try {
			setNewTagButtonLoading(true);
			const act: string = cookies.get("act") || "";

			await createNewTag(newTagName, act);

			alert("Successfully created!");
			setNewTagName("");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setNewTagButtonLoading(false);
	}

	// Обновление выбранного тега
	const updateCurrentTag = async () => {
		if (typeof currentTagId !== "undefined") {
			try {
				setSaveTagButtonLoading(true);
				const act: string = cookies.get("act") || "";

				await updateTag({name: updateTagName, id: currentTagId, act, groupId: currentGroupId});
				await getData();

				alert("Successfully updated!");
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
			}
			setSaveTagButtonLoading(false);
		}
	}

	// Удаление выбранного тега
	const deleteCurrentTag = async () => {
		if (typeof currentTagId !== "undefined") {
			try {
				setDeleteTagButtonLoading(true);
				const act: string = cookies.get("act") || "";

				await deleteTag({id: currentTagId, act});
				await getData();

				setCurrentTagId(undefined);

				alert("Successfully deleted!");
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
			}
			setDeleteTagButtonLoading(false);
		}
	}

	// Обработчик выбора группы для тега из списка
	const selectGroup = (groupId: number) => {
		if (currentGroupId === groupId) {
			setCurrentGroupId(undefined);
		} else {
			setCurrentGroupId(groupId);
		}
	}

	// Метод получения данных с сервера
	async function getData() {
		try {
			const act: string = cookies.get("act") || "";
			const [responseTags, responseGroups] = await Promise.all([
				getAllTags({act}),
				getAllGroups(act),
			]);

			setAllTags(responseTags);
			setFilteredTags(responseTags);

			setAllGroups(responseGroups);
			setFilteredGroups(responseGroups);

			setLoading(false);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	// Получаем данные о тегах
	useEffect(() => {
		getData();
	}, []);

	// Обновляем массив найденных тегов при изменении строки запроса
	useEffect(() => {
		if (finderTagText.length === 0) {
			setFilteredTags(allTags);
		} else {
			setFilteredTags(
				allTags.filter(tag => tag.name.toLowerCase().includes(finderTagText.toLowerCase()))
			);
		}
	}, [finderTagText]);

	// Обновляем массив найденных групп при изменении строки запроса
	useEffect(() => {
		if (finderGroupText.length === 0) {
			setFilteredGroups(allGroups);
		} else {
			setFilteredGroups(
				allGroups.filter(group => group.name.toLowerCase().includes(finderGroupText.toLowerCase()))
			);
		}
	}, [finderGroupText]);

	// Обновляем состояние выбранной группы при выборе нового тега
	useEffect(() => {
		if (currentTagId) {
			const tag = allTags.find(el => el.id === currentTagId);
			setCurrentGroupId(tag?.groupId)
		}
	}, [currentTagId]);

	// Обновляем состояние имени при выборе тега
	useEffect(() => {
		const tag = allTags.find(el => el.id === currentTagId);
		if (tag) {
			setUpdateTagName(tag.name);
		}
	}, [currentGroupId]);

	if (loading) {
		return (
			<Spinner animation="border" role="status">
				<span className="visually-hidden">Loading...</span>
			</Spinner>
		)
	}

	return (
		<Accordion>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Create new tag</Accordion.Header>
				<Accordion.Body>
					<Row>
						<Form.Group as={Col} lg="10">
							<Form.Label htmlFor="name">Name of new tag*</Form.Label>
							<InputGroup>
								<Form.Control
									id="name"
									placeholder="Tag name"
									aria-label="Tag name"
									value={newTagName}
									onChange={(e) => setNewTagName(e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
					</Row>
					<Row className="mt-2">
						<Col>
							<Button
								onClick={createTag}
								variant="primary"
								type="submit"
								disabled={newTagButtonLoading}
							>
								{newTagButtonLoading ? (
									<Spinner animation="border" role="status">
										<span className="visually-hidden">Loading...</span>
									</Spinner>
								) : (
									<>Add new</>
								)}
							</Button>
						</Col>
					</Row>
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header>Manage existing tags</Accordion.Header>
				<Accordion.Body>
					<Row>
						<Form.Group as={Col} lg="10">
							<Form.Label htmlFor="finder">Finder</Form.Label>
							<InputGroup>
								<Form.Control
									id="finder"
									placeholder="Tag name"
									aria-label="Tag name"
									value={finderTagText}
									onChange={(e) => setFinderTagText(e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
					</Row>
					<Row className="mt-3">
						<Col lg={12}>
							<Form.Label>List of tags</Form.Label>
							<div style={{ overflow: 'auto', height: '200px' }}>
								<div className="d-flex flex-wrap gap-2">
									{filteredTags.map((tag, index) => (
										<Button
											onClick={() => setCurrentTagId(tag.id)}
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
					</Row>
					{currentTagId && (
						<>
							<Row>
								<Form.Label>Current tag: (id: {currentTagId}; name: {allTags.find(el => el.id === currentTagId)?.name})</Form.Label>
								<Form.Group as={Col} lg="4">
									<InputGroup>
										<Form.Control
											id="update_name"
											placeholder="Tag name"
											aria-label="Tag name"
											value={updateTagName}
											onChange={(e) => setUpdateTagName(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Col lg={4}>
									<Button
										onClick={updateCurrentTag}
										variant="primary"
										className="w-100"
									>
										{saveTagButtonLoading ? (
											<Spinner animation="border" role="status">
												<span className="visually-hidden">Loading...</span>
											</Spinner>
										) : (
											<>Update tag</>
										)}
									</Button>
								</Col>
								<Col lg={4}>
									<Button
										onClick={deleteCurrentTag}
										variant="danger"
										className="w-100"
									>
										{deleteTagButtonLoading ? (
											<Spinner animation="border" role="status">
												<span className="visually-hidden">Loading...</span>
											</Spinner>
										) : (
											<>Delete current tag</>
										)}
									</Button>
								</Col>
							</Row>
							<Row className="mt-3">
								<Form.Group as={Col} lg="10">
									<InputGroup>
										<Form.Control
											placeholder="Group name"
											aria-label="Group name"
											value={finderGroupText}
											onChange={(e) => setFinderGroupText(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
							</Row>
							<Row className="mt-3">
								<Col lg={12}>
									<div style={{ overflow: 'auto', height: '200px' }}>
										<div className="d-flex flex-wrap gap-2">
											{filteredGroups.map((group, index) => (
												<Button
													onClick={() => selectGroup(group.id)}
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
						</>
					)}
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
};

export default ManageTags;
import {Accordion, Button, Col, Row, Spinner} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import {createGroup, deleteGroup, getAllGroups, updateGroup} from "../../api/tag/tagApi.ts";
import type {GroupResponse} from "../../api/tag/types.ts";

const ManageGroups = () => {

	const cookies = new Cookies();

	const [loading, setLoading] = useState<boolean>(false);
	const [updateGroupButtonLoading, setUpdateGroupButtonLoading] = useState<boolean>(false);
	const [deleteGroupButtonLoading, setDeleteGroupButtonLoading] = useState<boolean>(false);

	const [groupName, setGroupName] = useState<string>("");
	const [updateGroupName, setUpdateGroupName] = useState<string>("");

	const [createGroupButtonLoading, setCreateGroupButtonLoading] = useState<boolean>(false);

	const [allGroups, setAllGroups] = useState<GroupResponse[]>([]);
	const [filteredGroups, setFilteredGroups] = useState<GroupResponse[]>([]);
	const [finderGroupText, setFinderGroupText] = useState<string>("");

	const [currentGroupId, setCurrentGroupId] = useState<number | undefined>(undefined);

	// Создание новой группы
	const createNewGroup = async () => {
		try {
			setCreateGroupButtonLoading(true);
			const act: string = cookies.get("act") || "";

			await createGroup({name: groupName, act});

			alert("Successfully created!");
			setGroupName("");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setCreateGroupButtonLoading(false);
	}

	// Обновление выбранной группы
	const updateCurrentGroup = async () => {
		if (currentGroupId !== undefined) {
			try {
				setUpdateGroupButtonLoading(true);
				const act: string = cookies.get("act") || "";

				await updateGroup({id: currentGroupId, name: updateGroupName, act});
				await getData();

				alert("Successfully updated!");
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
			}
			setUpdateGroupButtonLoading(false);
		}
	}

	// Удаление выбранной группы
	const deleteCurrentGroup = async () => {
		if (currentGroupId !== undefined) {
			try {
				setDeleteGroupButtonLoading(true);
				const act: string = cookies.get("act") || "";

				await deleteGroup({id: currentGroupId, act});
				await getData();

				alert("Successfully updated!");
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
			}
			setDeleteGroupButtonLoading(false);
		}
	}

	// Получение данных
	async function getData() {
		try {
			const act: string = cookies.get("act") || "";
			const responseGroups = await getAllGroups(act);

			setAllGroups(responseGroups);
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
		if (finderGroupText.length === 0) {
			setFilteredGroups(allGroups);
		} else {
			setFilteredGroups(
				allGroups.filter(group => group.name.toLowerCase().includes(finderGroupText.toLowerCase()))
			);
		}
	}, [finderGroupText]);

	// Обновляем состояние имени при выборе группы
	useEffect(() => {
		const group = allGroups.find(el => el.id === currentGroupId);
		if (group) {
			setUpdateGroupName(group.name);
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
				<Accordion.Header>Create new groups</Accordion.Header>
				<Accordion.Body>
					<Row>
						<Form.Group as={Col} lg="10">
							<Form.Label htmlFor="name">Name of new group*</Form.Label>
							<InputGroup>
								<Form.Control
									id="name"
									placeholder="Group name"
									aria-label="Group name"
									value={groupName}
									onChange={(e) => setGroupName(e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
					</Row>
					<Row className="mt-2">
						<Col>
							<Button
								onClick={createNewGroup}
								variant="primary"
								type="submit"
								disabled={createGroupButtonLoading}
							>
								{createGroupButtonLoading ? (
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
				<Accordion.Header>Manage existing groups</Accordion.Header>
				<Accordion.Body>
					<Row>
						<Form.Group as={Col} lg="10">
							<Form.Label htmlFor="finder">Finder</Form.Label>
							<InputGroup>
								<Form.Control
									id="finder"
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
							<Form.Label>List of groups</Form.Label>
							<div style={{ overflow: 'auto', height: '200px' }}>
								<div className="d-flex flex-wrap gap-2">
									{filteredGroups.map((group, index) => (
										<Button
											onClick={() => setCurrentGroupId(group.id)}
											key={index}
											variant="outline-primary"
											size="sm"
										>
											{group.name}
										</Button>
									))}
								</div>
							</div>
						</Col>
					</Row>
					{currentGroupId && (
						<>
							<Row>
								<Form.Label>Current group: (id: {currentGroupId}; name: {allGroups.find(el => el.id === currentGroupId)?.name})</Form.Label>
								<Form.Group as={Col} lg="4">
									<InputGroup>
										<Form.Control
											id="update_name"
											placeholder="Tag name"
											aria-label="Tag name"
											value={updateGroupName}
											onChange={(e) => setUpdateGroupName(e.target.value)}
										/>
									</InputGroup>
								</Form.Group>
								<Col lg={4}>
									<Button
										onClick={updateCurrentGroup}
										variant="primary"
										className="w-100"
									>
										{updateGroupButtonLoading ? (
											<Spinner animation="border" role="status">
												<span className="visually-hidden">Loading...</span>
											</Spinner>
										) : (
											<>Update group</>
										)}
									</Button>
								</Col>
								<Col lg={4}>
									<Button
										onClick={deleteCurrentGroup}
										variant="danger"
										className="w-100"
									>
										{deleteGroupButtonLoading ? (
											<Spinner animation="border" role="status">
												<span className="visually-hidden">Loading...</span>
											</Spinner>
										) : (
											<>Delete current group</>
										)}
									</Button>
								</Col>
							</Row>
							<Row className="mt-3">
								<Col lg={12}>
									<div style={{ overflow: 'auto', height: '200px' }}>
										<div className="d-flex flex-wrap gap-2">
											{allGroups.find(el => el.id === currentGroupId)?.tags.map((tag, index) => (
												<Button
													key={index}
													variant="outline-primary"
													size="sm"
													disabled
												>
													{tag.name}
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

export default ManageGroups;
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import {CategoryCard} from "../widgets/CategoryCard";
import {useEffect, useState} from "react";
import type {CategoryBlockResponse, CategoryLinkResponse, CategorySubBlockResponse} from "../api/category/types.ts";
import {getCategories, updateCategories} from "../api/category/api.ts";
import Cookies from "universal-cookie";

const Categories = () => {

	const cookies = new Cookies();

	const [loading, setLoading] = useState(true);
	const [loadingSaveButton, setLoadingSaveButton] = useState(false);

	const [blocks, setBlocks] = useState<CategoryBlockResponse[]>([]);
	const [links, setLinks] = useState<CategoryLinkResponse[]>([]);
	const [subBlocks, setSubBlocks] = useState<CategorySubBlockResponse[]>([]);

	const [files, setFiles] = useState<{id: number, file: File}[]>([]);

	const addNewBlock = () => {
		setBlocks(prevState => [...prevState, {
			id: -Date.now(),
			blockText: "",
			index: prevState.length,
			preview: {filename: "empty"},
		}]);
	}

	const addNewSubBlock = (categoryBlockId: number) => {
		const block = blocks.find(block => block.id === categoryBlockId);
		if (block) {
			const existSubBlocks = subBlocks.filter(subBlock => subBlock.categoryBlockId === categoryBlockId);
			setSubBlocks(prevState => [...prevState, {
				id: -Date.now(),
				blockLink: "",
				name: "",
				index: existSubBlocks.length,
				preview: {filename: "empty"},
				categoryBlockId
			}]);
		}
	}

	const addNewLink = (categoryBlockId: number) => {
		const block = blocks.find(block => block.id === categoryBlockId);
		if (block) {
			const existLinks = links.filter(link => link.categoryBlockId === categoryBlockId);
			setLinks(prevState => [...prevState, {
				id: -Date.now(),
				link: "",
				linkText: "",
				index: existLinks.length,
				categoryBlockId
			}]);
		}
	}

	const updateBlockText = (id: number, value: string) => {
		setBlocks(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					blockText: value,
				}
			} else return el;
		}));
	}

	const updateBlockImage = (id: number, file: File) => {
		const block = blocks.find(block => block.id === id);
		if (!block) return;

		const clientId = -Date.now();
		setFiles(prevState =>
			[...prevState.filter(el => el.id !== block?.preview.clientId), {id: clientId, file}]
		);
		setBlocks(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					preview: {filename: file.name, clientId}
				}
			} else return el
		}))
	}

	const updateSubBlockImage = (id: number, file: File) => {
		const subBlock = subBlocks.find(block => block.id === id);
		if (!subBlock) return;

		const clientId = -Date.now();
		setFiles(prevState => [
			...prevState.filter(el => el.id !== subBlock?.preview.clientId), {id: clientId, file}
		]);
		setSubBlocks(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					preview: {filename: file.name, clientId}
				}
			} else return el
		}))
	}

	const updateSubBlockStringField = (id: number, value: string, field: keyof CategorySubBlockResponse) => {
		const subBlock = subBlocks.find(block => block.id === id);
		if (subBlock) {
			setSubBlocks(prevState => prevState.map(el => {
				if (el.id === id) {
					return {
						...el,
						[field]: value,
					}
				} else return el
			}))
		}
	}

	const updateLinkStringField = (id: number, value: string, field: keyof CategoryLinkResponse) => {
		const link = links.find(link => link.id === id);
		if (link) {
			setLinks(prevState => prevState.map(el => {
				if (el.id === id) {
					return {
						...el,
						[field]: value,
					}
				} else return el
			}))
		}
	}

	const removeBlock = (id: number) => {
		const block = blocks.find(block => block.id === id);
		if (!block) return;

		setBlocks(prevState => prevState.map(el => {
			if (el.id !== block.id) {
				return {
					...el,
					index: el.index > block.index ? el.index - 1 : el.index,
				}
			}
		}).filter(el => el !== undefined))
	}

	const removeSubBlock = (id: number) => {
		const subBlock = subBlocks.find(block => block.id === id);
		if (!subBlock) return;

		setSubBlocks(prevState => prevState.map(el => {
			if (el.id !== subBlock.id) {
				if (el.categoryBlockId === subBlock.categoryBlockId) {
					return {
						...el,
						index: el.index > subBlock.index ? el.index - 1 : el.index,
					}
				} else return el
			}
		}).filter(el => el !== undefined))
	}

	const removeLink = (id: number) => {
		const link = links.find(link => link.id === id);
		if (!link) return;

		setLinks(prevState => prevState.map(el => {
			if (el.id !== link.id) {
				if (el.categoryBlockId === link.categoryBlockId) {
					return {
						...el,
						index: el.index > link.index ? el.index - 1 : el.index,
					}
				} else return el
			}
		}).filter(el => el !== undefined))
	}

	const moveBlock = (id: number, direction: 1 | -1) => {
		const block = blocks.find(block => block.id === id);
		if (!block) return;

		const secondBlock = blocks.find(p => p.index === block.index + direction);
		if (!secondBlock) return;

		setBlocks(prevState => prevState.map(el => {
			if (el.id === secondBlock.id) {
				return {
					...el,
					index: el.index - direction,
				}
			} else if (el.id === id) {
				return {
					...el,
					index: el.index + direction,
				}
			} else return el
		}))
	}

	const moveSubBlock = (id: number, direction: 1 | -1) => {
		const subBlock = subBlocks.find(block => block.id === id);
		if (!subBlock) return;

		console.log(subBlocks.filter(el => el.categoryBlockId === subBlock.categoryBlockId))

		const secondBlock = subBlocks.find(s =>
			s.categoryBlockId == subBlock.categoryBlockId && s.index === subBlock.index + direction
		);
		if (!secondBlock) return;

		setSubBlocks(prevState => prevState.map(el => {
			if (el.id === secondBlock.id) {
				return {
					...el,
					index: el.index - direction,
				}
			} else if (el.id === id) {
				return {
					...el,
					index: el.index + direction,
				}
			} else return el
		}))
	}

	const moveLink = (id: number, direction: -1 | 1) => {
		const link = links.find(link => link.id === id);
		if (!link) return;

		const secondLink = links.find(s =>
			s.categoryBlockId === link.categoryBlockId && s.index === link.index + direction
		);
		if (!secondLink) return;

		setLinks(prevState => prevState.map(el => {
			if (el.id === secondLink.id) {
				return {
					...el,
					index: el.index - direction,
				}
			} else if (el.id === id) {
				return {
					...el,
					index: el.index + direction,
				}
			} else return el
		}))
	}

	async function saveData() {
		try {
			setLoadingSaveButton(true);
			const act: string = cookies.get("act") || "";

			const formData = new FormData();

			// Добавляем блоки в formData
			formData.append(
				"blocks",
				JSON.stringify(
					blocks.map(el => ({
						...el,
						preview: {imageId: el.preview.imageId, filename: el.preview.filename}
					}))
				)
			);

			// Добавляем под-блоки в formData
			formData.append(
				"subBlocks",
				JSON.stringify(
					subBlocks.map(el => ({
						...el,
						preview: {imageId: el.preview.imageId, filename: el.preview.filename},
					}))
				)
			);

			// Добавляем ссылки в formData
			formData.append(
				"links",
				JSON.stringify(links)
			);

			// Добавляем файлы
			files.forEach((file) => {
				formData.append("files", file.file);
			});

			// Обновляем данные на сервере
			await updateCategories(formData, act);

			alert("Данные успешно сохранены");
			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.error(e);
		}
		setLoadingSaveButton(false);
	}

	useEffect(() => {
		async function getData() {
			try {
				const act: string = cookies.get("act") || "";

				const response = await getCategories(act);

				setBlocks(response.blocks);
				setLinks(response.links);
				setSubBlocks(response.subBlocks);

				setLoading(false);
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.error(e);
			}
		}

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
				<Col className="mt-3">
					<Button
						onClick={saveData}
						disabled={loadingSaveButton}
						variant="warning"
						className="w-100"
					>
						{loadingSaveButton ? "Загрузка..." : "Сохранить данные"}
					</Button>
					<Button
						className="w-100 mt-2"
						onClick={addNewBlock}
					>
						Добавить новый блок
					</Button>
				</Col>
				{blocks.sort((a, b) => a.index - b.index).map((block, index) =>
					<Col key={index} className="mt-3" lg={12}>
						<CategoryCard
							block={block}
							links={links.filter(el => el.categoryBlockId === block.id)}
							subBlocks={subBlocks.filter(el => el.categoryBlockId === block.id)}

							addNewSubBlock={addNewSubBlock}
							addNewLink={addNewLink}

							updateBlockText={updateBlockText}
							updateBlockImage={updateBlockImage}
							updateSubBlockImage={updateSubBlockImage}
							updateSubBlockName={(id: number, value: string) => updateSubBlockStringField(id, value, 'name')}
							updateSubBlockUrl={(id: number, value: string) => updateSubBlockStringField(id, value, 'blockLink')}
							updateLinkAddressUrl={(id: number, value: string) => updateLinkStringField(id, value, 'link')}
							updateLinkTextUrl={(id: number, value: string) => updateLinkStringField(id, value, 'linkText')}

							moveBlock={moveBlock}
							moveSubBlock={moveSubBlock}
							moveLink={moveLink}

							removeLink={removeLink}
							removeSubBlock={removeSubBlock}
							removeBlock={removeBlock}

							files={files}
						/>
					</Col>
				)}
			</Row>
		</Container>
	);
};

export default Categories;
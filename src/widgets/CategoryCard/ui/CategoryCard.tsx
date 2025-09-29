import React, {type ChangeEvent, useRef} from 'react';
import {Accordion, Button, Card, Col, Row} from "react-bootstrap";
import type {
	CategoryBlockResponse,
	CategoryLinkResponse,
	CategorySubBlockResponse
} from "../../../api/category/types.ts";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ImageItem from "../../../components/products/image-selector/ImageItem.tsx";
import {SubBlockCard} from "../widgets/SubBlockCard";

interface CategoryCardProps {
	block: CategoryBlockResponse;
	links: CategoryLinkResponse[];
	subBlocks: CategorySubBlockResponse[];
	addNewSubBlock: (categoryBlockId: number) => void;
	addNewLink: (categoryBlockId: number) => void;
	updateBlockText: (id: number, value: string) => void;
	updateBlockImage: (id: number, file: File) => void;
	updateSubBlockImage: (id: number, file: File) => void;
	updateSubBlockName: (id: number, value: string) => void;
	updateSubBlockUrl: (id: number, value: string) => void;
	updateLinkTextUrl: (id: number, value: string) => void;
	updateLinkAddressUrl: (id: number, value: string) => void;
	moveBlock: (id: number, direction: 1 | -1) => void;
	moveSubBlock: (id: number, direction: 1 | -1) => void;
	moveLink: (id: number, direction: 1 | -1) => void;
	removeBlock: (id: number) => void;
	removeSubBlock: (id: number) => void;
	removeLink: (id: number) => void;
	files: {id: number, file: File}[];
}

export const CategoryCard: React.FC<CategoryCardProps> = (props) => {

	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files);
		const file = newFiles[0];
		props.updateBlockImage(props.block.id, file);
	}

	return (
		<Card>
			<Card.Body>
				<Card.Title>
					id блока: {props.block.id}
				</Card.Title>
				<Row>
					<Col lg={6}>
						<p>Превью блока* (1 картинка)</p>
						<ImageItem
							preview={props.block.preview}
							files={props.files.filter(el => el.id === props.block.preview.clientId).map(el => el.file)}
						/>
						<Col className="mt-3" md={12}>
							<Button
								variant="primary"
								onClick={handleAddClick}
							>
								Изменить изображение
							</Button>
							<input
								type="file"
								accept="image/*"
								multiple
								ref={inputFileRef}
								onChange={handleFilesChange}
								style={{display: 'none'}}
							/>
						</Col>
					</Col>
					<Form.Group as={Col} lg="6">
						<Form.Label htmlFor="name">Название блока*</Form.Label>
						<InputGroup>
							<Form.Control
								id="name"
								placeholder="Название блока*"
								aria-label="Название блока"
								value={props.block.blockText}
								onChange={(e) => props.updateBlockText(props.block.id, e.target.value)}
							/>
						</InputGroup>
					</Form.Group>
				</Row>
				<Row className="mt-4">
					<Accordion>
						<Accordion.Item eventKey="1">
							<Accordion.Header>Добавить под-блоки</Accordion.Header>
							<Accordion.Body>
								<Button
									className="w-100 mt-2"
									onClick={() => props.addNewSubBlock(props.block.id)}
								>
									Добавить новый под-блок
								</Button>
								{props.subBlocks.sort((a, b) => a.index - b.index).map((subBlock, index) =>
									<SubBlockCard
										key={index}
										subBlock={subBlock}

										updateSubBlockImage={props.updateSubBlockImage}
										updateSubBlockName={props.updateSubBlockName}
										updateSubBlockUrl={props.updateSubBlockUrl}

										moveSubBlock={props.moveSubBlock}

										files={props.files}

										removeSubBlock={props.removeSubBlock}
									/>
								)}
							</Accordion.Body>
						</Accordion.Item>
						<Accordion.Item eventKey="0">
							<Accordion.Header>Добавить ссылки</Accordion.Header>
							<Accordion.Body>
								<Button
									onClick={() => props.addNewLink(props.block.id)}
									className="w-100 mt-2"
								>
									Добавить новую ссылку
								</Button>
								{props.links.sort((a, b) => a.index - b.index).map((link, index) =>
									<Card
										key={index}
										className="mt-3"
									>
										<Card.Body>
											<Card.Title>
												id ссылки: {link.id}
											</Card.Title>
											<Row>
												<Form.Group as={Col} lg="6">
													<Form.Label htmlFor="link_text">Текст ссылки*</Form.Label>
													<InputGroup>
														<Form.Control
															id="link_text"
															placeholder="Текст ссылки*"
															aria-label="Текст ссылки"
															value={link.linkText}
															onChange={(e) => props.updateLinkTextUrl(link.id, e.target.value)}
														/>
													</InputGroup>
												</Form.Group>
												<Form.Group as={Col} lg="6">
													<Form.Label htmlFor="link_address">Адрес ссылки*</Form.Label>
													<InputGroup>
														<Form.Control
															id="link_address"
															placeholder="Адрес ссылки*"
															aria-label="Адрес ссылки"
															value={link.link}
															onChange={(e) => props.updateLinkAddressUrl(link.id, e.target.value)}
														/>
													</InputGroup>
												</Form.Group>
											</Row>
											<Row className="mt-4">
												<Col lg={2}>
													<Button
														onClick={() => props.moveLink(link.id, 1)}
														className="w-100"
													>
														На позицию ниже
													</Button>
												</Col>
												<Col lg={2}>
													<Button
														onClick={() => props.moveLink(link.id, -1)}
														className="w-100"
													>
														На позицию выше
													</Button>
												</Col>
												<Col lg={{span: 2, offset: 6}}>
													<Button
														onClick={() => props.removeLink(link.id)}
														variant="danger"
														className="w-100"
													>
														Удалить
													</Button>
												</Col>
											</Row>
										</Card.Body>
									</Card>
								)}
							</Accordion.Body>
						</Accordion.Item>
					</Accordion>
				</Row>
				<Row className="mt-4">
					<Col lg={2}>
						<Button
							onClick={() => props.moveBlock(props.block.id, 1)}
							className="w-100"
						>
							На позицию ниже
						</Button>
					</Col>
					<Col lg={2}>
						<Button
							onClick={() => props.moveBlock(props.block.id, -1)}
							className="w-100"
						>
							На позицию выше
						</Button>
					</Col>
					<Col lg={{span: 2, offset: 6}}>
						<Button
							onClick={() => props.removeBlock(props.block.id)}
							variant="danger"
							className="w-100"
						>
							Удалить
						</Button>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};
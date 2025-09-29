import {Button, Card, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import React, {type ChangeEvent, useRef} from "react";
import type {CategorySubBlockResponse} from "../../../../../api/category/types.ts";
import ImageItem from "../../../../../components/products/image-selector/ImageItem.tsx";

interface SubBlockCardProps {
	subBlock: CategorySubBlockResponse;
	updateSubBlockImage: (id: number, file: File) => void;
	updateSubBlockName: (id: number, value: string) => void;
	updateSubBlockUrl: (id: number, value: string) => void;
	moveSubBlock: (id: number, direction: 1 | -1) => void;
	files: {id: number, file: File}[];
	removeSubBlock: (id: number) => void;
}

export const SubBlockCard: React.FC<SubBlockCardProps> = (
	{subBlock, updateSubBlockUrl, updateSubBlockName, updateSubBlockImage, files, removeSubBlock, moveSubBlock}
) => {

	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files);
		const file = newFiles[0];
		updateSubBlockImage(subBlock.id, file);
	}

	return (
		<Card
			className="mt-3"
		>
			<Card.Body>
				<Card.Title>
					id под-блока: {subBlock.id}
				</Card.Title>
				<Row>
					<Col lg={6}>
						<p>Превью под-блока* (1 картинка)</p>
						<ImageItem
							preview={subBlock.preview}
							files={files.filter(el => el.id === subBlock.preview.clientId).map(el => el.file)}
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
					<Col lg={6}>
						<Form.Group as={Col} lg="12">
							<Form.Label htmlFor="subBlock_name">Название под-блока*</Form.Label>
							<InputGroup>
								<Form.Control
									id="subBlock_name"
									placeholder="Название под-блока*"
									aria-label="Название под-блока"
									value={subBlock.name}
									onChange={(e) => updateSubBlockName(subBlock.id, e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
						<Form.Group className="mt-3" as={Col} lg="12">
							<Form.Label htmlFor="subBlock_link">Ссылка под-блока*</Form.Label>
							<InputGroup>
								<Form.Control
									id="subBlock_link"
									placeholder="Название под-блока*"
									aria-label="Название под-блока"
									value={subBlock.blockLink}
									onChange={(e) => updateSubBlockUrl(subBlock.id, e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Row className="mt-4">
						<Col lg={2}>
							<Button
								onClick={() => moveSubBlock(subBlock.id, 1)}
								className="w-100"
							>
								На позицию ниже
							</Button>
						</Col>
						<Col lg={2}>
							<Button
								onClick={() => moveSubBlock(subBlock.id, -1)}
								className="w-100"
							>
								На позицию выше
							</Button>
						</Col>
						<Col lg={{span: 2, offset: 6}}>
							<Button
								onClick={() => removeSubBlock(subBlock.id)}
								variant="danger"
								className="w-100"
							>
								Удалить
							</Button>
						</Col>
					</Row>
				</Row>
			</Card.Body>
		</Card>
	)
}
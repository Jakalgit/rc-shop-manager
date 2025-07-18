import React, {type ChangeEvent, useRef} from 'react';
import {Button, Card, Col, Image, Row} from "react-bootstrap";
import type {SlideResponse} from "../../api/promotion-slider/types.ts";
import type {NewSlide} from "../../pages/PromotionSliderContent.tsx";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface IProps {
	slide: SlideResponse | NewSlide;
	slides: (SlideResponse | NewSlide)[];
	moveUp: (slide: NewSlide | SlideResponse) => void;
	moveDown: (slide: NewSlide | SlideResponse) => void;
	removeSlide: (id: number) => void;
	pinFileForSlide: (id: number, file: File) => void;
	updateHrefForSlide: (id: number, href: string) => void;
}

const SliderCard: React.FC<IProps> = ({ slide, slides, moveDown, moveUp, removeSlide, pinFileForSlide, updateHrefForSlide }) => {

	const inputFileRef = useRef<HTMLInputElement>(null);

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const file = e.target.files[0];
		pinFileForSlide(slide.id, file);
	}

	return (
		<Col className="mt-3" md={12}>
			<Card className="h-100">
				<Card.Body>
					<Row className="mb-4">
						<Card.Title>
							id: {slide.id}
						</Card.Title>

					</Row>
					<Row>
						{slide.id < 0 && (
							<Col md={12}>
								<Button
									variant="primary"
									onClick={handleAddClick}
								>
									Добавить изображение
								</Button>
								<input
									type="file"
									accept="image/*"
									ref={inputFileRef}
									onChange={handleFilesChange}
									style={{display: 'none'}}
								/>
							</Col>
						)}
						{'file' in slide && slide.file !== null && (
							<Col className="mt-4" md={12}>
								<p>{slide.file.name}</p>
								<Image
									src={URL.createObjectURL(slide.file)}
									alt={slide.file.name}
									rounded
									style={{
										maxHeight: 150,
										width: 'auto',
										objectFit: 'contain',
									}}
								/>
							</Col>
						)}
						{'filename' in slide && (
							<Col className="mt-4" md={12}>
								<p>{slide.filename}</p>
								<Image
									src={`${import.meta.env.VITE_CLOUD_URL}/${slide.filename}`}
									alt={slide.filename}
									rounded
									style={{
										maxHeight: 150,
										width: 'auto',
										objectFit: 'contain',
									}}
								/>
							</Col>
						)}
						<Row className="mt-3">
							<Form.Group as={Col} md="12">
								<InputGroup>
									<Form.Control
										placeholder="Введите ссылку слайда"
										aria-label="Ссылка слайда"
										value={slide.href}
										onChange={(e) => updateHrefForSlide(slide.id, e.target.value)}
									/>
								</InputGroup>
							</Form.Group>
						</Row>
					</Row>
					<Row className="mt-4">
						{slide.id !== slides[0].id && (
							<Col md={2}>
								<Button
									className="w-100"
									onClick={() => moveUp(slide)}
								>
									Выше
								</Button>
							</Col>
						)}
						{slide.id !== slides[slides.length - 1].id && (
							<Col md={2}>
								<Button
									className="w-100"
									onClick={() => moveDown(slide)}
								>
									Ниже
								</Button>
							</Col>
						)}
						<Col md={2}>
							<Button
								variant="danger"
								className="w-100"
								onClick={() => removeSlide(slide.id)}
							>
								Удалить
							</Button>
						</Col>
					</Row>
				</Card.Body>
			</Card>
		</Col>
	);
};

export default SliderCard;
import {useEffect, useState} from 'react';
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import type {SlideResponse} from "../api/promotion-slider/types.ts";
import {getSlides, updateSlides} from "../api/promotion-slider/promotionSliderApi.ts";
import Cookies from "universal-cookie";
import SliderCard from "../components/promotion-slider/SliderCard.tsx";

export type NewSlide = {
	id: number;
	file: File | null;
	href: string;
}

const PromotionSliderContent = () => {

	const cookies = new Cookies();

	const [loading, setLoading] = useState(true);
	const [buttonLoading, setButtonLoading] = useState(false);
	const [slides, setSlides] = useState<(SlideResponse | NewSlide)[]>([]);

	const addNewSlide = () => {
		setSlides(prevState => [...prevState, {id: -Date.now(), file: null, href: ''}]);
	}

	const removeSlide = (id: number) => {
		setSlides(prevState => prevState.filter(el => el.id !== id));
	}

	const swapItems = (array: any[], index: number, move: -1 | 1) => {
		const newArray = [...array];
		[newArray[index + move], newArray[index]] = [newArray[index], newArray[index + move]];
		return newArray;
	}

	const moveUp = (slide: NewSlide | SlideResponse) => {
		const index = slides.indexOf(slide);
		if (index === 0) return;
		setSlides(prevState => swapItems(prevState, index, -1));
	};

	const moveDown = (slide: NewSlide | SlideResponse) => {
		const index = slides.indexOf(slide);
		if (index === slides.length - 1) return;
		setSlides(prevState => swapItems(prevState, index, 1));
	};

	const pinFileForSlide = (id: number, file: File) => {
		if (id < 0) {
			setSlides(prevState => prevState.map(el => {
				if (el.id === id) {
					return {
						...el, file
					}
				} else return el;
			}))
		} else {
			alert("Ошибка")
		}
	}

	const updateHrefForSlide = (id: number, href: string) => {
		setSlides(prevState => prevState.map(el => {
			if (el.id === id) {
				return {
					...el,
					href,
				}
			} else return el;
		}))
	}

	const saveSlides = async () => {
		try {
			if (slides.find(el => el.id < 0 && 'file' in el && el.file === null)) {
				alert("Ошибка: нужно заполнить картинками все новые слайды");
				return;
			}
			setButtonLoading(true);
			const formData = new FormData();

			const items = slides.map(slide => {
				if (slide.id < 0 && 'file' in slide) {
					return {
						href: slide.href,
						filename: slide.file?.name,
					}
				} else {
					return {
						id: slide.id,
						href: slide.href,
						imageId: (slide as SlideResponse).imageId,
					}
				}
			});

			formData.append("items", JSON.stringify(items));
			slides.forEach(slide => {
				if ("file" in slide && slide.file) {
					formData.append("files[]", slide.file);
				}
			});

			const act: string = cookies.get("act") || "";

			await updateSlides(formData, act);

			alert("Слайдер успешно обновлён.");

			window.location.reload();
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}

		setButtonLoading(false);
	}

	useEffect(() => {
		async function getData() {
			try {
				const response = await getSlides();

				console.log(response);

				setSlides(response);
				setLoading(false);
			} catch (e: any) {
				alert(e?.response?.data?.message);
				console.log(e);
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
			<Row className="mb-3 mt-3">
				<Col lg={6}>
					<Button
						className="w-100"
						type="submit"
						variant="primary"
						onClick={addNewSlide}
					>
						Добавить слайд
					</Button>
				</Col>
				<Col lg={6}>
					<Button
						className="w-100"
						type="submit"
						variant="primary"
						onClick={saveSlides}
					>
						{buttonLoading ? (
							<Spinner animation="border" role="status">
								<span className="visually-hidden">Загрузка...</span>
							</Spinner>
						) : (
							<>Сохранить контент</>
						)}
					</Button>
				</Col>
			</Row>
			<Row>
				{slides.map((slide, index) =>
					<SliderCard
						key={index}
						slide={slide}
						slides={slides}
						moveUp={moveUp}
						moveDown={moveDown}
						removeSlide={removeSlide}
						pinFileForSlide={pinFileForSlide}
						updateHrefForSlide={updateHrefForSlide}
					/>
				)}
			</Row>
		</Container>
	);
};

export default PromotionSliderContent;
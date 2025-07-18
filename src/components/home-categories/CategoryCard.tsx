import React, {type ChangeEvent, useRef, useState} from 'react';
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import stylesProducts from "../../styles/components/AllProduct.module.css";
import type {HomeCategoryResponse} from "../../api/home-category/types.ts";

interface IProps {
	item: HomeCategoryResponse
	updateImage: (id: number, image: File) => Promise<void>,
	deleteCurrentHomeCategory: (id: number) => Promise<void>,
}

const CategoryCard: React.FC<IProps> = ({ item, updateImage, deleteCurrentHomeCategory }) => {

	const inputFileRef = useRef<HTMLInputElement>(null);

	const [loadingUpdateButton, setLoadingUpdateButton] = useState<boolean>(false);
	const [loadingDeleteButton, setLoadingDeleteButton] = useState<boolean>(false);

	const handleAddClick = () => {
		inputFileRef.current?.click();
	};

	const handleFilesChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		setLoadingUpdateButton(true);
		const newFiles = Array.from(e.target.files);
		const file = newFiles[0];
		await updateImage(item.id, file);
		setLoadingUpdateButton(false);
	}

	const deleteCategory = async () => {
		setLoadingDeleteButton(true);
		await deleteCurrentHomeCategory(item.id);
		setLoadingDeleteButton(false);
	}

	return (
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
				<Row>
					<Col md={12}>
						<Button
							className="mt-3"
							onClick={handleAddClick}
							variant="primary"
							disabled={loadingUpdateButton}
						>
							{loadingUpdateButton ? (
								<Spinner animation="border" role="status">
									<span className="visually-hidden">Загрузка...</span>
								</Spinner>
							) : (
								"Изменить изображение"
							)}
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
					<Col md={12}>
						<Button
							className="mt-3"
							onClick={deleteCategory}
							variant="danger"
							disabled={loadingDeleteButton}
						>
							{loadingDeleteButton ? (
								<Spinner animation="border" role="status">
									<span className="visually-hidden">Загрузка...</span>
								</Spinner>
							) : (
								"Удалить"
							)}
						</Button>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default CategoryCard;
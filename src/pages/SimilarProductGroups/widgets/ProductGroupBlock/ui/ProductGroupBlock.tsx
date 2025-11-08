import React, {useCallback, useEffect, useState} from "react";
import type {ProductGroup} from "../../../../../api/product-group/types.ts";
import {Button, Card, Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Cookies from "universal-cookie";
import {createProductGroup, updateProductGroup} from "../../../../../api/product-group/api.ts";

interface ProductGroupBlockProps {
	compareFields: (keyof ProductGroup)[];
	initial?: ProductGroup;
	current: ProductGroup;
	setCurrent: (field: keyof ProductGroup, value: ProductGroup[keyof ProductGroup]) => void;
	dropProductGroup: (id: number) => Promise<void>;
	getData: () => Promise<void>;
}

export const ProductGroupBlock: React.FC<ProductGroupBlockProps> = React.memo((
	{ compareFields, initial, current, setCurrent, dropProductGroup, getData }
) => {

	const cookies = new Cookies();

	const [visibleSaveButton, setVisibleSaveButton] = useState<boolean>(false);

	const handleClickSave = useCallback(async () => {
		const act = cookies.get("act") || "";

		if (current.name.length < 5) {
			alert('Название группы продуктов должно содержать не менее 5 символов');
		}

		try {
			if (current.id >= 0) {
				await updateProductGroup(current, act);
			} else {
				await createProductGroup({ name: current.name, token: act });
			}

			await getData();

			alert('Изменения успешно сохранены');
		} catch (e: any) {
			alert(e.response?.data?.message);
		}
	}, [current]);

	useEffect(() => {
		if (!initial) {
			setVisibleSaveButton(true);
			return;
		}

		const isChanged = compareFields.some(field => initial[field] !== current[field]);
		setVisibleSaveButton(isChanged);
	}, [initial, current]);

	return (
		<Col
			className="mt-3"
			md={12}
		>
			<Card className="w-100">
				<Card.Body>
					<Card.Title>
						<strong>ID:</strong> {current.id}
					</Card.Title>
					<Row className="mt-4">
						<Form.Group as={Col} lg="12">
							<InputGroup>
								<Form.Control
									id="group-name"
									placeholder="Введите текст..."
									aria-label="Название группы"
									value={current.name}
									onChange={(e) => setCurrent('name', e.target.value)}
								/>
							</InputGroup>
						</Form.Group>
					</Row>
					<Row className="mt-4">
						<Col md={2}>
							<Button
								onClick={() => dropProductGroup(current.id)}
								className="w-100"
								variant="danger"
							>
								Удалить
							</Button>
						</Col>
						{visibleSaveButton && (
							<Col md={2}>
								<Button
									onClick={handleClickSave}
									className="w-100"
									variant="primary"
								>
									Сохранить
								</Button>
							</Col>
						)}
					</Row>
				</Card.Body>
			</Card>
		</Col>
	)
});
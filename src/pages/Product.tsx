import {useState} from 'react';
import {useParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import Cookies from "universal-cookie";
import {DetailEnum} from "../api/product/types.ts";
import {isNumeric} from "../functions/isNumeric.ts";
import {getProductPagination, updateProduct} from "../api/product/productApi.ts";
import {getAllTags} from "../api/tag/tagApi.ts";
import ManageProductTemplate, {type GetDataProps, type ISaveProductArguments} from "../components/products/ManageProductTemplate.tsx";

const Product = () => {
	const { id } = useParams<{ id: string }>();

	const cookies = new Cookies();

	const [loadingSaveButton, setLoadingSaveButton] = useState(false);

	const alertOnNumber = (value: string, valueName: string) => {
		if (value.length !== 0 && !isNumeric(value)) {
			alert(`${valueName} должна быть числом`);
			return false;
		}
		return true;
	}

	const saveProductInDatabase = async (props: ISaveProductArguments) => {
		const fieldToCheckNumber = [
			{value: props.price, name: "Цена"},
			{value: props.oldPrice, name: "Цена до скидки"},
			{value: props.width, name: "Ширина"},
			{value: props.height, name: "Высота"},
			{value: props.weight, name: "Вес"},
			{value: props.length, name: "Длина"},
			{value: props.wholesalePrice, name: "Оптовая цена"},
		];

		try {
			setLoadingSaveButton(true);
			// Проверяем некоторые поля на соответствие числу
			for (const item of fieldToCheckNumber) {
				const result = alertOnNumber(item.value, item.name);
				if (!result) {
					break;
				}
			}

			// Создаем FormData
			const formData = new FormData();

			formData.append("name", props.name);
			formData.append("availability", String(props.availability));
			formData.append("visibility", String(props.visibility));
			formData.append("count", String(props.count));
			formData.append("price", String(props.price));
			formData.append("wholesalePrice", String(props.wholesalePrice));
			formData.append("article", props.article);

			if (props.oldPrice) {
				formData.append("oldPrice", props.oldPrice);
			}

			if (props.promotionPercentage) {
				formData.append("promotionPercentage", props.promotionPercentage);
			}

			formData.append("previews", JSON.stringify(
				props.previews.map((el, index) => {
					if (typeof el.imageId === "undefined") {
						return {
							filename: el.filename,
							index,
						}
					} else {
						return {
							imageId: el.imageId,
							index,
						}
					}
				})
			));
			props.files.forEach(file => {
				formData.append('files[]', file);
			});
			formData.append("tagIds", JSON.stringify(props.selectedTags.map(el => el.id)));
			formData.append("details", JSON.stringify(props.details.map(el => {
				const r = {
					text: el.text,
					detailType: el.detailType,
				}
				if (el.id < 0) {
					return r;
				} else {
					return {
						...r,
						id: el.id,
					}
				}
			})));

			const act: string = cookies.get("act") || "";

			await updateProduct(formData, Number(props.id), act);

			alert("Товар успешно сохранён.");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setLoadingSaveButton(false);
		window.location.reload();
	}

	async function getData(props: GetDataProps) {
		try {
			const act: string = cookies.get("act") || "";
			const [responseTags, responseData] = await Promise.all([
				getAllTags({act}),
				getProductPagination({id: Number(id)}, act),
			])
			props.setAllTags(responseTags);
			props.setFinderTags(responseTags);

			if (responseData.records.length !== 0) {
				const item = responseData.records[0];

				props.setName(item.name);
				props.setPrice(item.price.toString());
				props.setWholesalePrice(item.wholesalePrice.toString());
				props.setArticle(item.article);
				props.setCount(item.count);

				props.setOldPrice((item.oldPrice || "").toString());
				props.setPromotionPercentage((item.promotionPercentage || "").toString());

				props.setWeight((item.weight || "").toString());
				props.setLength((item.length || "").toString());
				props.setWidth((item.width || "").toString());
				props.setHeight((item.height || "").toString());

				const dt = [
					...item.description.map(el => ({id: el.id, text: el.text, detailType: DetailEnum.DESCRIPTION})),
					...item.specification.map(el => ({id: el.id, text: el.text, detailType: DetailEnum.SPECIFICATION})),
					...item.equipment.map(el => ({id: el.id, text: el.text, detailType: DetailEnum.EQUIPMENT})),
				];
				props.setDetails(dt);

				props.setSelectedTags(item.tags);
				props.setPreviews(item.images.map(el => ({imageId: el.imageId, filename: el.filename})));
			}
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	return (
		<Container className="mt-5">
			<ManageProductTemplate
				saveProductInDatabase={saveProductInDatabase}
				getData={getData}
				loadingSaveButton={loadingSaveButton}
				id={Number(id)}
			/>
		</Container>
	);
};

export default Product;
import {Container} from "react-bootstrap";
import {useState} from "react";
import {getAllTags} from "../../api/tag/tagApi.ts";
import {isNumeric} from "../../functions/isNumeric.ts";
import {createProduct} from "../../api/product/productApi.ts";
import Cookies from "universal-cookie";
import ManageProductTemplate, {type GetDataProps, type ISaveProductArguments} from "./ManageProductTemplate.tsx";

const AddNewProduct = () => {

	const cookies = new Cookies();

	const [loadingSaveButton, setLoadingSaveButton] = useState(false);

	const alertOnNumber = (value: string, valueName: string) => {
		if (value.length !== 0 && !isNumeric(value)) {
			alert(`${valueName} must be a number`);
			return false;
		}
		return true;
	}

	const saveProductInDatabase = async (props: ISaveProductArguments) => {
		const fieldToCheckNumber = [
			{value: props.price, name: "Price"},
			{value: props.oldPrice, name: "Old Price"},
			{value: props.width, name: "Width"},
			{value: props.height, name: "Height"},
			{value: props.weight, name: "Weight"},
			{value: props.length, name: "length"},
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
			formData.append("article", props.article);

			if (props.oldPrice) {
				formData.append("oldPrice", props.oldPrice);
			}

			if (props.promotionPercentage) {
				formData.append("promotionPercentage", props.promotionPercentage);
			}

			formData.append("previews", JSON.stringify(
				props.previews.map((el, index) => ({...el, index}))
			));
			props.files.forEach(file => {
				formData.append('files[]', file);
			});
			formData.append("tagIds", JSON.stringify(props.selectedTags.map(el => el.id)));
			formData.append("details", JSON.stringify(props.details.map(({id, ...rest}) => rest)));

			const act: string = cookies.get("act") || "";

			await createProduct(formData, act);

			alert("Product added successfully.");
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
		setLoadingSaveButton(false);
	}

	async function getData(props: GetDataProps) {
		try {
			const act: string = cookies.get("act") || "";
			const response = await getAllTags({act});
			props.setAllTags(response);
			props.setFinderTags(response);
		} catch (e: any) {
			alert(e?.response?.data?.message);
			console.log(e);
		}
	}

	return (
		<Container fluid>
			<ManageProductTemplate
				saveProductInDatabase={saveProductInDatabase}
				getData={getData}
				loadingSaveButton={loadingSaveButton}
			/>
		</Container>
	);
};

export default AddNewProduct;
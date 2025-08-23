import AddNewProduct from "../components/products/AddNewProduct.tsx";
import AllProducts from "../components/products/AllProducts.tsx";
import TabsComponent from "../components/TabsComponent.tsx";

const Products = () => {

	const tabItems = [
		{
			title: "Все товары",
			eventKey: "all_product",
			tsx: <AllProducts />
		},
		{
			title: "Добавить новый товар",
			eventKey: "add_new_product",
			tsx: <AddNewProduct />
		}
	]

	return (
		<TabsComponent items={tabItems} />
	);
};

export default Products;
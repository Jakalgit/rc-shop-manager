import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AddNewProduct from "../components/products/AddNewProduct.tsx";
import AllProducts from "../components/products/AllProducts.tsx";

const Products = () => {

	const tabItems = [
		{
			title: "All Products",
			eventKey: "all_product",
			tsx: <AllProducts />
		},
		{
			title: "Add New Product",
			eventKey: "add_new_product",
			tsx: <AddNewProduct />
		}
	]

	return (
		<Tabs
			defaultActiveKey="all_product"
			id="justify-tab-example"
			className="mb-4"
			justify
		>
			{tabItems.map((item) =>
				<Tab eventKey={item.eventKey} title={item.title}>
					{item.tsx}
				</Tab>
			)}
		</Tabs>
	);
};

export default Products;
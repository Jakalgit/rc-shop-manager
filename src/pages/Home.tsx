import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import styles from "../styles/pages/Home.module.css";
import Products from "./Products.tsx";
import {Container} from "react-bootstrap";
import TagsAndGroups from "./TagsAndGroups.tsx";
import Contacts from "./Contacts.tsx";
import RepairServices from "./RepairServices.tsx";
import UserRequestComponent from "./UserRequest.tsx";
import HomeCategories from "./HomeCategories.tsx";
import {useState} from "react";

const Home = () => {

	const [currentTab, setCurrentTab] = useState<string>("statistics");

	const tabItems = [
		{
			name: 'Статистика',
			eventKey: 'statistics',
			tab: <></>,
			path: '/statistics',
		},
		{
			name: 'Товары',
			eventKey: 'products',
			tab: <Products />,
			path: '/products'
		},
		{
			name: 'Теги и группы',
			eventKey: 'tags_and_groups',
			tab: <TagsAndGroups />,
			path: '/tags-and-groups'
		},
		{
			name: 'Изображения',
			eventKey: 'images',
			tab: <></>,
			path: '/images'
		},
		{
			name: 'Контакты',
			eventKey: 'contacts',
			tab: <Contacts />,
			path: '/contacts'
		},
		{
			name: 'Услуги ремонта',
			eventKey: 'repair_services',
			tab: <RepairServices />,
			path: '/repair-services'
		},
		{
			name: 'Контент слайдера',
			eventKey: 'slider_content',
			tab: <></>,
			path: '/slider-content',
		},
		{
			name: 'Пользовательские запросы',
			eventKey: 'user_requests',
			tab: <UserRequestComponent />,
			path: '/user-requests'
		},
		{
			name: 'Категории стартовой стр.',
			eventKey: 'home_categories',
			tab: <HomeCategories />,
			path: '/home-categories'
		},
		{
			name: 'Заказы',
			eventKey: 'orders',
			tab: <></>,
			path: '/orders'
		}
	]

	return (
		<Container fluid>
			<Tab.Container defaultActiveKey={tabItems[0].eventKey}>
				<Row>
					<Col lg={2} md={3}>
						<Nav className={`flex-column ${styles.navbar}`} variant="pills">
							{tabItems.map(item =>
								<Nav.Item>
									<Nav.Link onClick={() => setCurrentTab(item.eventKey)}>
										{item.name}
									</Nav.Link>
								</Nav.Item>
							)}
						</Nav>
					</Col>
					<Col
						style={{ maxHeight: '100vh', overflowY: 'auto' }}
						lg={10}
						md={9}
					>
						{tabItems.find(el => el.eventKey === currentTab)?.tab}
					</Col>
				</Row>
			</Tab.Container>
		</Container>
	);
};

export default Home;
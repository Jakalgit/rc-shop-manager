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
import PromotionSliderContent from "./PromotionSliderContent.tsx";
import {TabParamEnum} from "../enums/tab-param.enum.ts";
import {useSearchParams} from "react-router-dom";

const Home = () => {

	const tabItems = [
		{
			name: 'Статистика',
			eventKey: 'statistics',
			tab: <></>,
			path: TabParamEnum.STATISTICS,
		},
		{
			name: 'Товары',
			eventKey: 'products',
			tab: <Products />,
			path: TabParamEnum.PRODUCTS,
		},
		{
			name: 'Теги и группы',
			eventKey: 'tags_and_groups',
			tab: <TagsAndGroups />,
			path: TabParamEnum.TAGS_AND_GROUPS
		},
		{
			name: 'Изображения',
			eventKey: 'images',
			tab: <></>,
			path: TabParamEnum.IMAGES
		},
		{
			name: 'Контакты',
			eventKey: 'contacts',
			tab: <Contacts />,
			path: TabParamEnum.CONTACTS
		},
		{
			name: 'Услуги ремонта',
			eventKey: 'repair_services',
			tab: <RepairServices />,
			path: TabParamEnum.REPAIR_SERVICES
		},
		{
			name: 'Контент слайдера',
			eventKey: 'slider_content',
			tab: <PromotionSliderContent />,
			path: TabParamEnum.SLIDER_CONTENT
		},
		{
			name: 'Пользовательские запросы',
			eventKey: 'user_requests',
			tab: <UserRequestComponent />,
			path: TabParamEnum.USER_REQUESTS
		},
		{
			name: 'Категории стартовой стр.',
			eventKey: 'home_categories',
			tab: <HomeCategories />,
			path: TabParamEnum.HOME_CATEGORIES
		},
		{
			name: 'Заказы',
			eventKey: 'orders',
			tab: <></>,
			path: TabParamEnum.ORDERS
		}
	];

	const [searchParams, setSearchParams] = useSearchParams();

	let tabParam = searchParams.get("tab");
	let tabComponent = tabItems.find(el => el.path === tabParam)?.tab;

	if (!tabComponent) {
		tabComponent = tabItems[0].tab;
		setSearchParams({tab: TabParamEnum.STATISTICS});
	}

	return (
		<Container fluid>
			<Tab.Container defaultActiveKey={tabItems[0].eventKey}>
				<Row>
					<Col lg={2} md={3}>
						<Nav className={`flex-column ${styles.navbar}`} variant="pills">
							{tabItems.map(item =>
								<Nav.Item className={tabParam === item.path ? styles.selectedNavItem : ''}>
									<Nav.Link onClick={() => setSearchParams({tab: item.path})}>
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
						{tabComponent}
					</Col>
				</Row>
			</Tab.Container>
		</Container>
	);
};

export default Home;
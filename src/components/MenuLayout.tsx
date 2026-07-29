import {PathEnum} from "../consts/routes.tsx";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import styles from "../styles/components/MenuLayout.module.css";
import {Container} from "react-bootstrap";
import {Outlet, useLocation} from "react-router-dom";

function MenuLayout() {

	const tabItems = [
		{
			name: 'Статистика',
			eventKey: 'statistics',
			path: PathEnum.STATISTICS,
		},
		{
			name: 'Товары',
			eventKey: 'products',
			path: PathEnum.PRODUCTS,
		},
		{
			name: 'Теги и группы',
			eventKey: 'tags_and_groups',
			path: PathEnum.TAGS_AND_GROUPS,
		},
		{
			name: 'Группы похожих товаров',
			eventKey: 'similar_products',
			path: PathEnum.SIMILAR_PRODUCT_GROUPS,
		},
		{
			name: 'Изображения',
			eventKey: 'images',
			path: PathEnum.IMAGES,
		},
		{
			name: 'Контакты',
			eventKey: 'contacts',
			path: PathEnum.CONTACTS,
		},
		{
			name: 'Услуги ремонта',
			eventKey: 'repair_services',
			path: PathEnum.REPAIR_SERVICES,
		},
		{
			name: 'Контент слайдера',
			eventKey: 'slider_content',
			path: PathEnum.PROMOTION_SLIDER_CONTENT,
		},
		{
			name: 'Пользовательские запросы',
			eventKey: 'user_requests',
			path: PathEnum.USER_REQUESTS,
		},
		{
			name: 'Категории стартовой стр.',
			eventKey: 'home_categories',
			path: PathEnum.HOME_PAGE_CATEGORIES,
		},
		{
			name: 'Доставка и оплата',
			eventKey: 'delivery_and_payments',
			path: PathEnum.DELIVERY_AND_PAYMENTS
		},
		{
			name: 'Партнеры',
			eventKey: 'profile',
			path: PathEnum.PARTNERS,
		},
		{
			name: 'Заказы',
			eventKey: 'orders',
			path: PathEnum.ORDERS,
		},
		{
			name: 'Сообщения',
			eventKey: 'messages',
			path: PathEnum.MESSAGES
		}
	];

	const location = useLocation();
	const rootPath = location.pathname.split("/")[1] || "";

	return (
		<Container fluid>
			<Tab.Container defaultActiveKey={tabItems[0].eventKey}>
				<Row>
					<Col lg={2} md={3}>
						<Nav className={`flex-column ${styles.navbar}`} variant="pills">
							{tabItems.map(item =>
								<Nav.Item className={rootPath === item.path.substr(1) ? styles.selectedNavItem : ''}>
									<Nav.Link href={item.path}>
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
						<Outlet />
					</Col>
				</Row>
			</Tab.Container>
		</Container>
	)
}

export default MenuLayout;
import React from "react";
import Login from "../pages/Login.tsx";
import Product from "../pages/Product.tsx";
import Partners from "../pages/Partners.tsx";
import Products from "../pages/Products.tsx";
import TagsAndGroups from "../pages/TagsAndGroups.tsx";
import UserRequest from "../pages/UserRequest.tsx";
import RepairServices from "../pages/RepairServices.tsx";
import PromotionSliderContent from "../pages/PromotionSliderContent.tsx";
import HomeCategories from "../pages/HomeCategories.tsx";
import Contacts from "../pages/Contacts.tsx";
import Orders from "../pages/Orders.tsx";
import Order from "../pages/Order.tsx";
import {DeliveryAndPayments} from "../pages/DeliveryAndPayments.tsx";

export interface RouteConfig {
	path: string;
	component: React.ReactNode;
	isPublic?: boolean; // Опционально: для приватных маршрутов
}

export const PathEnum = {
	STATISTICS: "/statistics",
	LOGIN: "/login",
	PRODUCT: "/product/:id",
	PARTNERS: "/partners",
	PRODUCTS: "/products",
	TAGS_AND_GROUPS: "/tags",
	ORDERS: "/orders",
	USER_REQUESTS: "/user-requests",
	REPAIR_SERVICES: "/repair-services",
	PROMOTION_SLIDER_CONTENT: "/promotion-slider-content",
	HOME_PAGE_CATEGORIES: "/home-categories",
	CONTACTS: "/contacts",
	IMAGES: "/images",
	ORDER: "/order/:orderNumber",
	DELIVERY_AND_PAYMENTS: "/delivery-and-payments",
} as const;

export const routes: RouteConfig[] = [
	{ path: PathEnum.STATISTICS, component: <></> },
	{ path: PathEnum.LOGIN, isPublic: true, component: <Login /> },
	{ path: PathEnum.PRODUCT, component: <Product /> },
	{ path: PathEnum.PARTNERS, component: <Partners /> },
	{ path: PathEnum.PRODUCTS, component: <Products /> },
	{ path: PathEnum.TAGS_AND_GROUPS, component: <TagsAndGroups /> },
	{ path: PathEnum.ORDERS, component: <Orders /> },
	{ path: PathEnum.USER_REQUESTS, component: <UserRequest /> },
	{ path: PathEnum.REPAIR_SERVICES, component: <RepairServices /> },
	{ path: PathEnum.PROMOTION_SLIDER_CONTENT, component: <PromotionSliderContent /> },
	{ path: PathEnum.HOME_PAGE_CATEGORIES, component: <HomeCategories /> },
	{ path: PathEnum.CONTACTS, component: <Contacts /> },
	{ path: PathEnum.IMAGES, component: <></> },
	{ path: PathEnum.ORDER, component: <Order /> },
	{ path: PathEnum.DELIVERY_AND_PAYMENTS, component: <DeliveryAndPayments /> }
]
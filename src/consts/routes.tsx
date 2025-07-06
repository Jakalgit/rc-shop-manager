import React from "react";
import Login from "../pages/Login.tsx";
import Home from "../pages/Home.tsx";
import Product from "../pages/Product.tsx";

export interface RouteConfig {
	path: string;
	component: React.ReactNode;
	isPrivate?: boolean; // Опционально: для приватных маршрутов
}

export const PathEnum = {
	DEFAULT: "/",
	LOGIN: "/login",
	PRODUCT: "/product/:id",
} as const;

export type PathEnum = keyof typeof PathEnum;

export const routes: RouteConfig[] = [
	{ path: PathEnum.DEFAULT, isPrivate: true, component: <Home /> },
	{ path: PathEnum.LOGIN, component: <Login /> },
	{ path: PathEnum.PRODUCT, component: <Product /> },
]
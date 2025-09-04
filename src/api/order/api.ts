import {$host} from "../index.ts";
import {
	DeliveryMethodEnum,
	DeliveryStatusEnum,
	type OrderResponse,
	PaymentMethodEnum,
	PaymentStatusEnum
} from "./types.ts";

export const getOrderByNumber = async (
	{orderNumber, token}: {orderNumber: string, token: string}
): Promise<OrderResponse> => {
	const {data} = await $host.get(`/order/adm/by-number/${orderNumber}`, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const getAllOrders = async (
	{page, limit, token}: {page: number, limit: number, token: string}
): Promise<{totalPages: number, records: OrderResponse[]}> => {
	const {data} = await $host.get(`/order/all?page=${page}&limit=${limit}`, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}

export const saveOrder = async (
	{token, ...rest}: {
		orderNumber: string;
		guestName?: string;
		guestPhone?: string;
		guestEmail?: string;
		address?: string | null;
		deliveryMethod?: typeof DeliveryMethodEnum[keyof typeof DeliveryMethodEnum];
		deliveryPrice?: number;
		deliveredAt?: string;
		deliveryStatus?: typeof DeliveryStatusEnum[keyof typeof DeliveryStatusEnum];
		trackingNumber?: string;
		paymentMethod?: typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
		discount?: number;
		paidAt?: string;
		paymentStatus?: typeof PaymentStatusEnum[keyof typeof PaymentStatusEnum];
		transactionId?: string;
		comment?: string;
		systemComment?: string;
		profileId?: string;
		token: string;
	}
): Promise<void> => {
	const {data} = await $host.put('/order/update-adm', rest, {headers: {Authorization: `Bearer ${token}`}});
	return data;
}
import type {CdekMetadataType} from "./cdek.types.ts";

export const DeliveryMethodEnum = {
	SELF_PICKUP: "self_pickup",
	DELIVERY_COUNTRY: "delivery_country",
	DELIVERY_MOSCOW: "delivery_moscow",
} as const;

export const PaymentMethodEnum =  {
	CASH_ON_DELIVERY: "cash_on_delivery",
	SBP: "sbp",
	BANK_TRANSFER: "bank_transfer",
} as const;

export const DeliveryStatusEnum = {
	PENDING: "pending",
	SHIPPED: "shipped",
	DELIVERED: "delivered",
} as const;

export const PaymentStatusEnum = {
	PENDING: "pending",
	PAID: "paid",
	FAILED: "failed",
	REFUNDED: "refunded",
} as const;

export const OrderStatusEnum = {
	PENDING: "pending",
	CONFIRMED: "confirmed",
	CANCELED: "canceled",
	COMPLETED: "completed",
} as const;

export const OrderActionEnum = {
	CREATE: "create", // Заказ создан,
	UPDATE: "update", // Изменены общие данные заказа (например, адрес или контакты)
	CANCEL: "cancel", // Заказ отменён (покупателем, админом или системой)
	RESTORE: "restore", // Восстановление отменённого заказа
	DELETE: "delete", // Заказ удален
} as const;

export const OrderActionActorEnum = {
	USER: "user",
	ADMIN: "admin",
	SYSTEM: "system",
} as const;

export type OrderItem = {
	name: string,
	price: number,
	quantity: number,
	article: string,
	productId: string,
}

export type OrderAction = {
	id: string;
	actionType: typeof OrderActionEnum[keyof typeof OrderActionEnum];
	oldValue: string | null;
	newValue: string | null;
	actorType: typeof OrderActionActorEnum[keyof typeof OrderActionActorEnum];
	userAgent: string | null;
	ipAddress: string | null;
	comment: string;
	orderId: string;
	createdAt: string;
}

export type OrderResponse = {
	id: string;
	orderNumber: string;
	guestName: string;
	guestPhone: string;
	guestEmail: string;
	address?: string;
	deliveryMethod: typeof DeliveryMethodEnum[keyof typeof DeliveryMethodEnum];
	deliveryPrice?: number;
	deliveredAt?: string;
	deliveryStatus?: typeof DeliveryStatusEnum[keyof typeof DeliveryStatusEnum];
	trackingNumber?: string;
	paymentMethod?: typeof PaymentMethodEnum[keyof typeof PaymentMethodEnum];
	subtotal: number;
	discount?: number;
	paidAt?: string;
	paymentStatus?: typeof PaymentStatusEnum[keyof typeof PaymentStatusEnum];
	comment?: string;
	systemComment?: string;
	createdAt: string;
	status: typeof OrderStatusEnum[keyof typeof OrderStatusEnum];
	userAgent?: string;
	ipAddress?: string;
	transactionId?: string;
	profileId?: string;
	cdekMetadata?: CdekMetadataType;
	items: OrderItem[];
	activities: OrderAction[];
}
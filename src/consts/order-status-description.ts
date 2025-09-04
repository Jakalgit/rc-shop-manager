import {OrderStatusEnum} from "../api/order/types.ts";

export const OrderStatusDescription = {
	[OrderStatusEnum.PENDING]: "Ожидает обработки",
	[OrderStatusEnum.CONFIRMED]: "Подтверждён",
	[OrderStatusEnum.COMPLETED]: "Завершён",
	[OrderStatusEnum.CANCELED]: "Отменён"
}
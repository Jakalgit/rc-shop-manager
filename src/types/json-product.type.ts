
export type JsonProductType = {
	name?: string, // Название товара
	article?: string, // Уникальный артикул товара
	price?: string, // Цена товара
	wholesalePrice?: string, // Оптовая цена товара
	availability?: boolean, // Наличие на складе
	count?: number, // Кол-во товара
	visibility?: boolean, // Видимость товара,
	oldPrice?: string, // Цена товара до скидки
	promotionPercentage?: string, // Размер скидки в процентах
	width?: string, // Ширина коробки
	length?: string, // Длина коробки
	height?: string, // Высота коробки
	weight?: string, // Вес
	description?: string[], // Описания товара
	specifications?: string[], // Спецификации товара
	equipment?: string[], // Комплектация товара
}
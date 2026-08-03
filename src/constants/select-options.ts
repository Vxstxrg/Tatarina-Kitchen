export const CATEGORY_OPTIONS = [
	{ label: "Овощи", value: "VEGETABLES" },
	{ label: "Фрукты", value: "FRUITS" },
	{ label: "Мясо", value: "MEAT" },
	{ label: "Молочные продукты", value: "DAIRY" },
	{ label: "Специи", value: "SPICES" },
	{ label: "Другое", value: "OTHER" },
] as const;

export const UNIT_OPTIONS = [
	{ label: "Граммы", value: "GRAMS" },
	{ label: "Килограммы", value: "KILOGRAMS" },
	{ label: "Литры", value: "LITERS" },
	{ label: "Миллилитры", value: "MILLILITERS" },
	{ label: "Штуки", value: "PIECES" },
] as const;


export const UNIT_ABBREVIATIONS = [
	{ value: "GRAMS", label: "г" },
	{ value: "KILOGRAMS",  label: "кг"},
	{ value: "LITERS", label: "л" },
	{ value: "MILLILITERS", label: "мл" },
	{ value: "PIECES", label: "шт" },
] as const
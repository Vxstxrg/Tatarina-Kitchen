import { z } from "zod";

export const signInSchema = z.object({
	email: z.string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: z.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(6, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export const ingredientSchema = z.object({
	name: z.string().min(1, "Введите название ингредиента"),

	category: z.enum(
		["VEGETABLES", "FRUITS", "MEAT", "DAIRY", "SPICES", "OTHER"],
		{ errorMap: () => ({ message: "Выберите корректную категорию" }) }
	),

	unit: z.enum(
		["GRAMS", "KILOGRAMS", "LITERS", "MILLILITERS", "PIECES"],
		{ errorMap: () => ({ message: "Выберите корректную единицу измерения" }) }
	),

	// Преобразуем пустую строку из FormData в null перед проверкой числа
	pricePerUnit: z.preprocess(
		(val) => {
			if (val === "" || val === null || val === undefined) return null;
			return Number(val);
		},
		z.number({ invalid_type_error: "Цена должна быть числом" })
			.min(0.01, "Цена должна быть больше 0")
			.nullable()
	),

	description: z.string().optional(),
});
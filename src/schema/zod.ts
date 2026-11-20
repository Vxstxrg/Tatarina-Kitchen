import { z } from "zod";

export const signInSchema = z.object({
	email: z.email("Некорректный Email"),
	password: z
		.string()
		.min(1, "Введите пароль")
		.min(6, "Пароль должен быть не короче 6 символов")
		.max(32, "Пароль должен быть не длиннее 32 символов"),
});

export const registerSchema = z
	.object({
		email: z.email("Некорректный Email"),
		password: z
			.string()
			.min(6, "Пароль должен быть не короче 6 символов")
			.max(32, "Пароль должен быть не длиннее 32 символов"),
		confirmPassword: z.string().min(1, "Повторите пароль"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});

export const ingredientSchema = z.object({
	name: z.string().trim().min(1, "Введите название ингредиента"),

	category: z.enum(["VEGETABLES", "FRUITS", "MEAT", "DAIRY", "SPICES", "OTHER"]),

	unit: z.enum(["GRAMS", "KILOGRAMS", "LITERS", "MILLILITERS", "PIECES"]),

	// Преобразуем пустую строку из формы в null перед проверкой числа
	pricePerUnit: z.preprocess(
		(val) => {
			if (val === "" || val === null || val === undefined) return null;
			return Number(val);
		},
		z
			.number()
			.min(0.01, "Цена должна быть больше 0")
			.nullable(),
	),

	description: z.string().trim().max(500, "Описание не длиннее 500 символов").optional(),
});

export const MAX_RECIPE_INGREDIENTS = 10;

export const recipeSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Введите название рецепта")
		.max(100, "Название не длиннее 100 символов"),
	description: z.string().trim().max(2000, "Описание не длиннее 2000 символов").optional(),
	imageUrl: z.preprocess(
		(val) => (val === "" || val === null || val === undefined ? null : String(val)),
		z
			.string()
			.regex(/^https?:\/\/\S+$/i, "Некорректный URL изображения")
			.nullable(),
	),
	ingredients: z
		.array(
			z.object({
				ingredientId: z.uuid("Выберите ингредиент"),
				quantity: z.preprocess(
					(val) => (Number.isNaN(val) ? undefined : val),
					z
						.number("Введите количество")
						.positive("Количество должно быть больше 0")
						.max(100000),
				),
			}),
		)
		.min(1, "Добавьте хотя бы один ингредиент")
		.max(
			MAX_RECIPE_INGREDIENTS,
			`Можно добавить не более ${MAX_RECIPE_INGREDIENTS} ингредиентов`,
		),
});

import { describe, expect, it } from "vitest";
import {
	ingredientSchema,
	registerSchema,
	signInSchema,
	recipeSchema,
} from "./zod";

const validIngredient = {
	name: "Картофель",
	category: "VEGETABLES",
	unit: "KILOGRAMS",
	pricePerUnit: "89.9",
	description: "Картофель для супов",
};

describe("signInSchema", () => {
	it("пропускает корректные данные", () => {
		const result = signInSchema.safeParse({
			email: "user@example.com",
			password: "secret123",
		});

		expect(result.success).toBe(true);
	});

	it("отклоняет некорректный email", () => {
		const result = signInSchema.safeParse({
			email: "not-an-email",
			password: "secret123",
		});

		expect(result.success).toBe(false);
	});

	it("отклоняет пароль короче 6 символов", () => {
		const result = signInSchema.safeParse({
			email: "user@example.com",
			password: "12345",
		});

		expect(result.success).toBe(false);
	});
});

describe("registerSchema", () => {
	it("пропускает совпадающие пароли", () => {
		const result = registerSchema.safeParse({
			email: "user@example.com",
			password: "secret123",
			confirmPassword: "secret123",
		});

		expect(result.success).toBe(true);
	});

	it("отклоняет несовпадающие пароли", () => {
		const result = registerSchema.safeParse({
			email: "user@example.com",
			password: "secret123",
			confirmPassword: "other12345",
		});

		expect(result.success).toBe(false);
	});
});

describe("ingredientSchema", () => {
	it("пропускает корректный ингредиент", () => {
		const result = ingredientSchema.safeParse(validIngredient);

		expect(result.success).toBe(true);
	});

	it("преобразует цену в число", () => {
		const result = ingredientSchema.safeParse(validIngredient);

		expect(result.success && result.data.pricePerUnit).toBe(89.9);
	});

	it("допускает отсутствие цены (null)", () => {
		const result = ingredientSchema.safeParse({
			...validIngredient,
			pricePerUnit: "",
		});

		expect(result.success).toBe(true);
	});

	it("отклоняет отрицательную цену", () => {
		const result = ingredientSchema.safeParse({
			...validIngredient,
			pricePerUnit: "-10",
		});

		expect(result.success).toBe(false);
	});

	it("отклоняет неизвестную категорию", () => {
		const result = ingredientSchema.safeParse({
			...validIngredient,
			category: "UNKNOWN",
		});

		expect(result.success).toBe(false);
	});
});

describe("recipeSchema", () => {
	const validRecipe = {
		name: "Эчпочмак",
		description: "Треугольные пирожки с мясом",
		imageUrl: "https://eda.ru/images/echpochmak.jpg",
		ingredients: [
			{ ingredientId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", quantity: 500 },
		],
	};

	it("пропускает корректный рецепт", () => {
		const result = recipeSchema.safeParse(validRecipe);

		expect(result.success).toBe(true);
	});

	it("пропускает пустой imageUrl как null", () => {
		const result = recipeSchema.safeParse({ ...validRecipe, imageUrl: "" });

		expect(result.success && result.data.imageUrl).toBeNull();
	});

	it("отклоняет рецепт без названия", () => {
		const result = recipeSchema.safeParse({ ...validRecipe, name: "   " });

		expect(result.success).toBe(false);
	});

	it("отклоняет рецепт без ингредиентов", () => {
		const result = recipeSchema.safeParse({
			...validRecipe,
			ingredients: [],
		});

		expect(result.success).toBe(false);
	});

	it("отклоняет нулевое количество ингредиента", () => {
		const result = recipeSchema.safeParse({
			...validRecipe,
			ingredients: [
				{ ingredientId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", quantity: 0 },
			],
		});

		expect(result.success).toBe(false);
	});

	it("отклоняет не-uuid id ингредиента", () => {
		const result = recipeSchema.safeParse({
			...validRecipe,
			ingredients: [{ ingredientId: "not-a-uuid", quantity: 100 }],
		});

		expect(result.success).toBe(false);
	});

	it("отклоняет битый URL картинки", () => {
		const result = recipeSchema.safeParse({
			...validRecipe,
			imageUrl: "eda.ru/image.jpg",
		});

		expect(result.success).toBe(false);
	});
});

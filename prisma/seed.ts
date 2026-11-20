/**
 * Демо-данные татарской кухни: ингредиенты и рецепты.
 * Скрипт идемпотентный — повторный запуск обновляет данные, а не дублирует.
 *
 * Запуск: npm run db:seed
 */
import "dotenv/config";
import { prisma } from "../src/utils/prisma";

type SeedIngredient = {
	name: string;
	category: "VEGETABLES" | "FRUITS" | "MEAT" | "DAIRY" | "SPICES" | "OTHER";
	unit: "GRAMS" | "KILOGRAMS" | "LITERS" | "MILLILITERS" | "PIECES";
	pricePerUnit: number | null;
	description?: string;
};

const INGREDIENTS: SeedIngredient[] = [
	{ name: "Говядина", category: "MEAT", unit: "KILOGRAMS", pricePerUnit: 650, description: "Филе или лопатка" },
	{ name: "Картофель", category: "VEGETABLES", unit: "KILOGRAMS", pricePerUnit: 90 },
	{ name: "Лук репчатый", category: "VEGETABLES", unit: "KILOGRAMS", pricePerUnit: 40 },
	{ name: "Мука пшеничная", category: "OTHER", unit: "KILOGRAMS", pricePerUnit: 70 },
	{ name: "Масло сливочное", category: "DAIRY", unit: "GRAMS", pricePerUnit: 12 },
	{ name: "Молоко", category: "DAIRY", unit: "LITERS", pricePerUnit: 80 },
	{ name: "Яйцо куриное", category: "OTHER", unit: "PIECES", pricePerUnit: 12 },
	{ name: "Мёд", category: "OTHER", unit: "GRAMS", pricePerUnit: 3, description: "Для чак-чака лучше липовый" },
	{ name: "Пшено", category: "OTHER", unit: "GRAMS", pricePerUnit: 1.5 },
	{ name: "Соль", category: "SPICES", unit: "GRAMS", pricePerUnit: 1 },
	{ name: "Перец чёрный молотый", category: "SPICES", unit: "GRAMS", pricePerUnit: 2 },
];

type SeedRecipe = {
	name: string;
	description: string;
	imageUrl: string;
	/** Название ингредиента из списка выше + количество в его единицах измерения */
	ingredients: { name: string; quantity: number }[];
};

const RECIPES: SeedRecipe[] = [
	{
		name: "Эчпочмак",
		description:
			"Треугольные пирожки с начинкой из рубленого мяса, картофеля и лука. Перед выпечкой в середину добавляют бульон.",
		imageUrl: "/recipes/echpochmak.jpg",
		ingredients: [
			{ name: "Говядина", quantity: 0.5 },
			{ name: "Картофель", quantity: 0.4 },
			{ name: "Лук репчатый", quantity: 0.2 },
			{ name: "Мука пшеничная", quantity: 0.5 },
			{ name: "Масло сливочное", quantity: 100 },
			{ name: "Соль", quantity: 5 },
			{ name: "Перец чёрный молотый", quantity: 2 },
		],
	},
	{
		name: "Бэлиш",
		description:
			"Большой праздничный пирог с уткой, говядиной или курицей, смешанными с картофелем и луком.",
		imageUrl: "/recipes/belesh.jpg",
		ingredients: [
			{ name: "Говядина", quantity: 0.7 },
			{ name: "Картофель", quantity: 0.6 },
			{ name: "Лук репчатый", quantity: 0.3 },
			{ name: "Мука пшеничная", quantity: 0.6 },
			{ name: "Масло сливочное", quantity: 150 },
			{ name: "Соль", quantity: 8 },
		],
	},
	{
		name: "Чак-чак",
		description:
			"Обжаренные в масле кусочки теста, залитые медовым сиропом. Традиционное угощение на торжествах.",
		imageUrl: "/recipes/chakchak.jpg",
		ingredients: [
			{ name: "Мука пшеничная", quantity: 0.4 },
			{ name: "Яйцо куриное", quantity: 3 },
			{ name: "Молоко", quantity: 0.2 },
			{ name: "Мёд", quantity: 200 },
			{ name: "Масло сливочное", quantity: 100 },
		],
	},
	{
		name: "Кыстыбый",
		description:
			"Тонкие лепёшки с начинкой из картофельного пюре или пшённой каши, смазанные сливочным маслом.",
		imageUrl: "/recipes/kystybyi.jpg",
		ingredients: [
			{ name: "Картофель", quantity: 0.5 },
			{ name: "Мука пшеничная", quantity: 0.3 },
			{ name: "Молоко", quantity: 0.15 },
			{ name: "Масло сливочное", quantity: 50 },
			{ name: "Соль", quantity: 5 },
		],
	},
];

async function seed() {
	console.log("Наполняю базу демо-данными...");

	for (const ingredient of INGREDIENTS) {
		const existing = await prisma.ingredient.findFirst({
			where: { name: ingredient.name },
		});

		if (existing) {
			await prisma.ingredient.update({
				where: { id: existing.id },
				data: ingredient,
			});
		} else {
			await prisma.ingredient.create({ data: ingredient });
		}
	}
	console.log(`Ингредиенты: ${INGREDIENTS.length}`);

	const allIngredients = await prisma.ingredient.findMany();
	const byName = new Map(allIngredients.map((item) => [item.name, item.id]));

	for (const recipe of RECIPES) {
		const { ingredients, ...data } = recipe;

		const links = ingredients
			.map(({ name, quantity }) => ({
				ingredientId: byName.get(name),
				quantity,
			}))
			.filter((link): link is { ingredientId: string; quantity: number } =>
				Boolean(link.ingredientId),
			);

		if (links.length !== ingredients.length) {
			throw new Error(`Рецепт «${recipe.name}»: не найдены некоторые ингредиенты`);
		}

		// Демо-рецепты остаются без владельца — их видят все, редактировать нельзя
		const existing = await prisma.recipe.findFirst({
			where: { name: recipe.name },
		});

		if (existing) {
			await prisma.recipe.update({
				where: { id: existing.id },
				data: {
					...data,
					ingredients: {
						deleteMany: {},
						create: links,
					},
				},
			});
		} else {
			await prisma.recipe.create({
				data: { ...data, ingredients: { create: links } },
			});
		}
	}
	console.log(`Рецепты: ${RECIPES.length}`);
	console.log("Готово.");
}

seed()
	.catch((error) => {
		console.error("Ошибка наполнения:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

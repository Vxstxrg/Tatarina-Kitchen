"use server";

import { prisma } from "@/utils/prisma";
import { getAuthUserId } from "@/utils/auth-guard";
import { MAX_RECIPE_INGREDIENTS, recipeSchema } from "@/schema/zod";
import type { ActionResult } from "@/types/action-result";
import type { ActionError } from "@/types/action-result";
import type { IRecipe } from "@/types/recipe";

const UNAUTHORIZED: ActionError = {
	success: false,
	error: "Требуется авторизация",
};

const NOT_AUTHOR: ActionError = {
	success: false,
	error: "Вы не автор этого рецепта",
};

/**
 * Проверяет, что текущий пользователь — владелец рецепта.
 * Рецепты без владельца (созданные до введения владения) никому не доступны для изменения.
 */
async function assertRecipeOwner(
	recipeId: string,
	userId: string,
): Promise<ActionError | null> {
	const recipe = await prisma.recipe.findUnique({
		where: { id: recipeId },
		select: { authorId: true },
	});

	if (!recipe) {
		return { success: false, error: "Рецепт не найден" };
	}

	if (recipe.authorId !== userId) {
		return NOT_AUTHOR;
	}

	return null;
}

/**
 * Собирает данные рецепта из FormData.
 * Поля ингредиентов приходят парами ingredient_${index} / quantity_${index}.
 * Строки с невыбранным ингредиентом отбрасываются.
 */
function parseRecipeForm(formData: FormData) {
	const ingredients = Array.from({ length: MAX_RECIPE_INGREDIENTS }, (_, index) => ({
		ingredientId: formData.get(`ingredient_${index}`),
		quantity: formData.get(`quantity_${index}`),
	})).filter(
		(item) => typeof item.ingredientId === "string" && item.ingredientId !== "",
	);

	return {
		name: formData.get("name"),
		description: formData.get("description"),
		imageUrl: formData.get("imageUrl"),
		ingredients: ingredients.map((item) => ({
			ingredientId: item.ingredientId,
			// Пустое поле количества приходит как null, Number(null) === 0 — не годится
			quantity: item.quantity === null ? Number.NaN : Number(item.quantity),
		})),
	};
}

export async function getRecipes(): Promise<ActionResult<IRecipe[]>> {
	try {
		// $extends(withAccelerate) стирает типы include, поэтому явный каст
		const recipes = (await prisma.recipe.findMany({
			orderBy: { name: "asc" },
			include: {
				ingredients: {
					include: {
						ingredient: true,
					},
				},
			},
		})) as unknown as IRecipe[];

		return { success: true, data: recipes };
	} catch (error) {
		console.error("getRecipes:", error);
		return { success: false, error: "Не удалось загрузить рецепты" };
	}
}

export async function createRecipe(
	formData: FormData,
): Promise<ActionResult<IRecipe>> {
	const userId = await getAuthUserId();
	if (!userId) return UNAUTHORIZED;

	const parsed = recipeSchema.safeParse(parseRecipeForm(formData));
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Проверьте поля формы",
		};
	}

	const { name, description, imageUrl, ingredients } = parsed.data;

	try {
		const recipe = await prisma.recipe.create({
			data: {
				name,
				description: description || "",
				imageUrl,
				authorId: userId,
				ingredients: {
					create: ingredients.map(({ ingredientId, quantity }) => ({
						ingredientId,
						quantity,
					})),
				},
			},
			include: {
				ingredients: {
					include: {
						ingredient: true,
					},
				},
			},
		});

		return { success: true, data: recipe };
	} catch (error) {
		console.error("createRecipe:", error);
		return { success: false, error: "Не удалось создать рецепт" };
	}
}

export async function updateRecipe(
	id: string,
	formData: FormData,
): Promise<ActionResult<IRecipe>> {
	const userId = await getAuthUserId();
	if (!userId) return UNAUTHORIZED;

	const parsed = recipeSchema.safeParse(parseRecipeForm(formData));
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Проверьте поля формы",
		};
	}

	const { name, description, imageUrl, ingredients } = parsed.data;

	try {
		const ownershipError = await assertRecipeOwner(id, userId);
		if (ownershipError) return ownershipError;

		// Замена состава ингредиентов и обновление рецепта — одна транзакция,
		// чтобы не осталось рецепта без ингредиентов при сбое посередине
		const [, recipe] = await prisma.$transaction([
			prisma.recipeIngredient.deleteMany({ where: { recipeId: id } }),
			prisma.recipe.update({
				where: { id },
				data: {
					name,
					description: description || "",
					imageUrl,
					ingredients: {
						create: ingredients.map(({ ingredientId, quantity }) => ({
							ingredientId,
							quantity,
						})),
					},
				},
				include: {
					ingredients: {
						include: {
							ingredient: true,
						},
					},
				},
			}),
		]);

		return { success: true, data: recipe };
	} catch (error) {
		console.error("updateRecipe:", error);
		return { success: false, error: "Не удалось обновить рецепт" };
	}
}

export async function deleteRecipe(id: string): Promise<ActionResult> {
	const userId = await getAuthUserId();
	if (!userId) return UNAUTHORIZED;

	try {
		const ownershipError = await assertRecipeOwner(id, userId);
		if (ownershipError) return ownershipError;

		// Связи удаляем в одной транзакции с рецептом
		await prisma.$transaction([
			prisma.recipeIngredient.deleteMany({ where: { recipeId: id } }),
			prisma.recipe.delete({ where: { id } }),
		]);

		return { success: true };
	} catch (error) {
		console.error("deleteRecipe:", error);
		return { success: false, error: "Не удалось удалить рецепт" };
	}
}

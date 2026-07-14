"use server";

import { prisma } from '@/utils/prisma';

export async function getRecipes() {
	try {
		const recipes = await prisma.recipe.findMany({
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				}
			}
		});
		return { success: true, recipes };
	} catch (error) {
		console.error("ошибка получение рецептов:", error);
		return { success: false, error: "Ошибка при загрузке рецептов" };
	}
}

export async function createRecipe(formData: FormData) {
	try {
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const imageUrl = formData.get("imageUrl") as string | null;

		const ingredients = Array.from(formData.entries())
			.filter(([key]) => key.startsWith("ingredient_"))
			.map(([key, value]) => ({
				ingredientId: value as string,
				quantity: parseFloat(
					formData.get(`quantity_${key.split("_")[1]}`) as string,
				)
			}));

		if (!name || ingredients.length === 0) {
			return {
				success: false,
				error: "Имя и хотя бы один ингредиент обязателен"
			};
		}

		const recipe = await prisma.recipe.create({
			data: {
				name,
				description,
				imageUrl,
				ingredients: {
					create: ingredients.map(({ ingredientId, quantity }) => ({
						// Исправлено: связываем через прямой ID промежуточной таблицы
						ingredientId,
						quantity
					}))
				}
			},
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				}
			}
		});

		return { success: true, data: recipe };
	} catch (error) {
		console.error("Error creating recipe:", error);
		return { success: false, error: "Ошибка при создании рецепта" };
	}
}

export async function updateRecipe(id: string, formData: FormData) {
	try {
		const name = formData.get("name") as string;
		const description = formData.get("description") as string;
		const imageUrl = formData.get("imageUrl") as string | null;

		const ingredients = Array.from(formData.entries())
			.filter(([key]) => key.startsWith("ingredient_"))
			.map(([key, value]) => ({
				ingredientId: value as string,
				quantity: parseFloat(
					formData.get(`quantity_${key.split("_")[1]}`) as string,
				)
			}));

		if (!name || ingredients.length === 0) {
			return {
				success: false,
				error: "Имя и хотя бы один ингредиент обязателен"
			};
		}

		const recipe = await prisma.recipe.update({
			where: { id },
			data: {
				name,
				description,
				imageUrl,
				ingredients: {
					deleteMany: {},
					create: ingredients.map(({ ingredientId, quantity }) => ({
						// Исправлено: аналогично createRecipe
						ingredientId,
						quantity
					}))
				}
			},
			include: {
				ingredients: {
					include: {
						ingredient: true
					}
				}
			}
		});
		return { success: true, data: recipe };
	} catch (error) {
		console.error("error updating recipe", error);
		return { success: false, error: "Ошибка при обновлении рецепта" };
	}
}

export async function deleteRecipe(id: string) {
	try {
		// Очищаем связи в связующей таблице
		await prisma.recipeIngredient.deleteMany({
			where: { recipeId: id }
		});

		// Удаляем сам рецепт
		await prisma.recipe.delete({
			where: { id }
		});

		// Исправлено: добавлен обязательный возврат статуса операции
		return { success: true };
	} catch (error) {
		console.error("Error deleting recipe", error);
		return { success: false, error: "Ошибка при удалении рецепта" };
	}
}

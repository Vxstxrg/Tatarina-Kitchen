"use server";

import { prisma } from "@/utils/prisma";
import { getAuthUserId } from "@/utils/auth-guard";
import { ingredientSchema } from "@/schema/zod";
import type { ActionResult } from "@/types/action-result";
import type { ActionError } from "@/types/action-result";
import type { IIngredient } from "@/types/ingredient";

const UNAUTHORIZED: ActionError = {
	success: false,
	error: "Требуется авторизация",
};

export async function getIngredients(): Promise<ActionResult<IIngredient[]>> {
	try {
		const ingredients = await prisma.ingredient.findMany({
			orderBy: { name: "asc" },
		});

		return { success: true, data: ingredients };
	} catch (error) {
		console.error("getIngredients:", error);
		return { success: false, error: "Не удалось загрузить ингредиенты" };
	}
}

export async function createIngredient(
	data: unknown,
): Promise<ActionResult<IIngredient>> {
	const userId = await getAuthUserId();
	if (!userId) return UNAUTHORIZED;

	const parsed = ingredientSchema.safeParse(data);
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Проверьте поля формы",
		};
	}

	try {
		const ingredient = await prisma.ingredient.create({
			data: {
				name: parsed.data.name,
				category: parsed.data.category,
				unit: parsed.data.unit,
				pricePerUnit: parsed.data.pricePerUnit,
				description: parsed.data.description || null,
			},
		});

		return { success: true, data: ingredient };
	} catch (error) {
		console.error("createIngredient:", error);
		return { success: false, error: "Не удалось сохранить ингредиент" };
	}
}

export async function deleteIngredient(id: string): Promise<ActionResult> {
	const userId = await getAuthUserId();
	if (!userId) return UNAUTHORIZED;

	try {
		await prisma.ingredient.delete({ where: { id } });
		return { success: true };
	} catch (error) {
		const code = (error as { code?: string }).code;

		if (code === "P2003") {
			return {
				success: false,
				error: "Ингредиент используется в рецептах — сначала удалите его из рецептов",
			};
		}

		// Повторное удаление уже отсутствующей записи считаем успехом
		if (code === "P2025") {
			return { success: true };
		}

		console.error("deleteIngredient:", error);
		return { success: false, error: "Не удалось удалить ингредиент" };
	}
}

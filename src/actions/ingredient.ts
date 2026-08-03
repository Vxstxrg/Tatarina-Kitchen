"use server";

import { ingredientSchema } from "@/schema/zod";
import { prisma } from "@/utils/prisma";
import { success } from 'zod';

export async function createIngredient(data: unknown) {
	// 1. Логируем сырые данные, которые пришли с клиента
	console.log("📥 [SERVER] 1. Полученные данные:", JSON.stringify(data, null, 2));

	// 2. Валидируем через Zod
	const validation = ingredientSchema.safeParse(data);

	if (!validation.success) {
		// 3. Если ошибка, выводим МАКСИМАЛЬНО подробно в терминал сервера
		console.error("❌ [SERVER] 2. Ошибка валидации Zod (сырая):", validation.error.errors);

		const flattened = validation.error.flatten();
		console.error("❌ [SERVER] 3. Ошибка валидации Zod (flattened):", flattened);

		// ГАРАНТИРОВАННО возвращаем ошибку, никогда не оставляем {}
		return {
			success: false,
			errors: {
				...flattened.fieldErrors,
				...(flattened.formErrors.length > 0
					? { _form: flattened.formErrors }
					: { _form: ["Неизвестная ошибка валидации на сервере"] })
			}
		};
	}

	console.log("✅ [SERVER] 4. Валидация успешна. Готовые данные:", validation.data);

	// 5. Пытаемся сохранить в БД
	try {
		const ingredient = await prisma.ingredient.create({
			data: {
				name: validation.data.name,
				category: validation.data.category,
				unit: validation.data.unit,
				pricePerUnit: validation.data.pricePerUnit,
				description: validation.data.description || undefined,
			},
		});

		console.log("✅ [SERVER] 5. Успешно создано в БД:", ingredient);
		return { success: true, ingredient };

	} catch (error) {
		// 6. Ловим ошибки Prisma (например, несовпадение типов)
		console.error("❌ [SERVER] 6. Ошибка базы данных (Prisma):", error);

		const errorMessage = error instanceof Error ? error.message : String(error);
		return {
			success: false,
			errors: { _form: [`Ошибка БД: ${errorMessage}`] }
		};
	}
}

export async function getIngredients() {
	try {
		const ingredients = await prisma.ingredient.findMany();
		return { success: true, ingredients };
	} catch (error) {
		console.error("Ошибка получения ингрдиентов:", error);
		return { error: "Ошибка получения ингрдиентов:" }
	}

};

export async function deleteIngredient(id: string) {
	try {
		const ingredient = await prisma.ingredient.delete({

			where: { id }

		});
		return { success: true, ingredient };
	} catch (error) {
		console.error("Ошибка удаления ингрдиента:", error);
		return { error: "Ошибка при удаления ингрдиента:" }
	}
}
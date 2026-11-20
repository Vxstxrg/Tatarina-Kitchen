"use server";

import { prisma } from "@/utils/prisma";
import { saltAndHashPassword } from "@/utils/password";
import { registerSchema } from "@/schema/zod";
import type { IFormData } from "@/types/form-data";

export async function registerUser(formData: IFormData) {
	const parsed = registerSchema.safeParse(formData);
	if (!parsed.success) {
		return {
			success: false,
			error: parsed.error.issues[0]?.message ?? "Проверьте поля формы",
		};
	}

	const { email, password } = parsed.data;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return { success: false, error: "Пользователь с таким Email уже существует" };
		}

		const passwordHash = await saltAndHashPassword(password);

		await prisma.user.create({
			data: {
				email,
				password: passwordHash,
			},
		});

		return { success: true };
	} catch (error) {
		console.error("registerUser:", error);
		return { success: false, error: "Ошибка при создании пользователя" };
	}
}

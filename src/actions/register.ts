"use server"
import { IFormData } from "../types/form-data";
import { prisma } from "@/utils/prisma";
import { saltAndHashPassword } from "@/utils/password";

export async function registerUser(formData: IFormData) {
	const { email, password, confirmPassword } = formData;

	if (password !== confirmPassword) {
		return { success: false, error: "Пароли не совпадают" };
	}

	if (password.length < 6) {
		return { success: false, error: "Пароль должен быть длиной не менее 6 символов" };
	}

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return { success: false, error: "Пользователь с таким Email уже существует" };
		}

		const pwHash = await saltAndHashPassword(password);

		const user = await prisma.user.create({
			data: {
				email: email,
				password: pwHash,
			},
		});

		console.log("✅ [SERVER] Пользователь успешно создан:", user.email);

		// Возвращаем объект без хэша пароля для безопасности UI
		return {
			success: true,
			user: {
				id: user.id,
				email: user.email
			}
		};

	} catch (error) {
		console.error("❌ [SERVER] Error creating user:", error);
		return { success: false, error: "Ошибка при создании пользователя" };
	}
}

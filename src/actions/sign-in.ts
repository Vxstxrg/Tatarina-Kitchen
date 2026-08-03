"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth/auth";

interface SignInResult {
	success: boolean;
	message: string;
}

export async function signInWithCredentials(
	email: string,
	password: string,
): Promise<SignInResult> {
	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false, // Оставляем false, но страхуем catch блок ниже
		});

		return {
			success: true,
			message: "Вы успешно вошли",
		};
	} catch (error) {
		// 1. КРИТИЧНО ДЛЯ NEXT.JS 15/16: Не перехватываем системные редиректы Next.js
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}

		console.error("❌ [SERVER] Ошибка авторизации:", error);

		// 2. Обработка ошибок Auth.js
		if (error instanceof AuthError) {
			// Проверяем тип ошибки или её код (в зависимости от суб-версий)
			if (error.type === "CredentialsSignin" || error.code === "credentials") {
				return {
					success: false,
					message: "Неверная почта или пароль",
				};
			}

			return {
				success: false,
				message: "Ошибка авторизации",
			};
		}

		return {
			success: false,
			message: "Неизвестная ошибка сервера",
		};
	}
}

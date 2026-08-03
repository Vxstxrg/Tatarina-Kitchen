"use server";

import { signOut } from "@/auth/auth";

export async function signOutFunc() {
	try {
		// Выполняем деавторизацию. 
		// Если нужен редирект на главную, можно передать { redirectTo: "/" }
		const result = await signOut({ redirect: false });

		console.log("✅ [SERVER] Сессия успешно завершена:", result);
		return result;
	} catch (error) {
		// КРИТИЧНО ДЛЯ NEXT.JS 16: Пропускаем системный редирект фреймворка наружу
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}

		console.error("❌ [SERVER] Настоящая ошибка при выходе из системы:", error);
		throw error;
	}
}

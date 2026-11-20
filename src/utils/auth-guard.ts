import { auth } from "@/auth/auth";

/**
 * Возвращает id текущего пользователя или null.
 * Используется в серверных экшенах как обязательная проверка перед мутациями:
 * клиентская проверка isAuth — только UX, защита должна быть на сервере.
 */
export async function getAuthUserId(): Promise<string | null> {
	const session = await auth();
	return session?.user?.id ?? null;
}

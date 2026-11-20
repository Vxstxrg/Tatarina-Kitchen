/**
 * Единый формат ответа серверных экшенов.
 * Все экшены возвращают либо успех (с данными или без), либо ошибку с текстом для UI.
 */
export type ActionError = { success: false; error: string };

export type ActionResult<T = void> =
	| (T extends void ? { success: true } : { success: true; data: T })
	| ActionError;

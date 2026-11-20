"use server";

import { signOut } from "@/auth/auth";

export async function signOutFunc() {
	try {
		await signOut({ redirect: false });
	} catch (error) {
		// Пропускаем системный редирект фреймворка наружу
		if (
			error instanceof Error &&
			error.message === "NEXT_REDIRECT"
		) {
			throw error;
		}

		console.error("signOut:", error);
		throw error;
	}
}

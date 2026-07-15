"use server";

import { signIn } from "@/auth/auth"


export async function signInWithCredentials(email: string, password: string) {
	try {
		await signIn("credentials", {
			email,
			password,
			redirect: false
		});

		

	} catch (error) {
		console.error("ошибка авторизации", error);
		throw error;
	}
}
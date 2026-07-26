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
			redirect: false,
		});

		return {
			success: true,
			message: "Вы успешно вошли",
		};
	} catch (error) {
		console.error("Ошибка авторизации:", error);

		if (error instanceof AuthError) {
			if (error.type === "CredentialsSignin") {
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
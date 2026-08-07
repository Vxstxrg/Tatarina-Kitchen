import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";

import { signInSchema } from "@/schema/zod";
import { getUserFromDb } from "@/utils/user";
import { prisma } from "@/utils/prisma";

const prismaAdapterClient = prisma as unknown as Parameters<typeof PrismaAdapter>[0];
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
	// Временно оставь true, чтобы видеть ошибки в терминале.
	debug: true,

	adapter: PrismaAdapter(prismaAdapterClient),

	secret: authSecret,

	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 1 час
	},

	providers: [
		Credentials({
			name: "Credentials",

			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},

			async authorize(credentials) {
				try {
					console.log("1. Полученные credentials:", credentials);

					// Проверяем email и пароль через Zod.
					const { email, password } =
						await signInSchema.parseAsync(credentials);

					console.log("2. Данные прошли Zod:", email);

					// Ищем пользователя в базе.
					const user = await getUserFromDb(email);

					console.log("3. Найден пользователь:", {
						id: user?.id,
						email: user?.email,
						hasPassword: Boolean(user?.password),
					});

					if (!user?.password) {
						console.log("4. Пользователь или пароль в БД отсутствует");
						return null;
					}

					// Сравниваем обычный пароль с хешем из БД.
					const isPasswordValid = await bcrypt.compare(
						password,
						user.password,
					);

					console.log("5. Результат проверки пароля:", isPasswordValid);

					if (!isPasswordValid) {
						return null;
					}

					const authorizedUser = {
						id: String(user.id),
						email: user.email,
					};

					console.log(
						"6. Авторизация успешна:",
						authorizedUser,
					);

					// Объект пользователя будет передан в jwt callback.
					return authorizedUser;
				} catch (error) {
					if (error instanceof ZodError) {
						console.error(
							"Ошибка Zod:",
							error.issues,
						);

						return null;
					}

					console.error("Ошибка authorize:", error);

					return null;
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			console.log("7. JWT callback:", {
				tokenBefore: token,
				user,
			});

			// user существует при успешном входе.
			if (user) {
				token.id = String(user.id);
			}

			console.log("8. JWT после изменения:", token);

			return token;
		},

		async session({ session, token }) {
			console.log("9. Session callback:", {
				sessionBefore: session,
				token,
			});

			if (session.user && token.id) {
				session.user.id = String(token.id);
			}

			console.log("10. Готовая session:", session);

			return session;
		},
	},
});
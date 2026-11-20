import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { signInSchema } from "@/schema/zod";
import { getUserFromDb } from "@/utils/user";
import { prisma } from "@/utils/prisma";

const prismaAdapterClient = prisma as unknown as Parameters<
	typeof PrismaAdapter
>[0];
const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
	trustHost: true,

	adapter: PrismaAdapter(prismaAdapterClient),

	secret: authSecret,

	session: {
		strategy: "jwt",
		maxAge: 60 * 60, // 1 час
	},

	pages: {
		// Страницы входа/регистрации — модальные окна на главной,
		// при прямом переходе на /api/auth возвращаем на главную
		signIn: "/",
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
					const { email, password } =
						await signInSchema.parseAsync(credentials);

					const user = await getUserFromDb(email);

					if (!user?.password) {
						return null;
					}

					const isPasswordValid = await bcrypt.compare(
						password,
						user.password,
					);

					if (!isPasswordValid) {
						return null;
					}

					return {
						id: String(user.id),
						email: user.email,
					};
				} catch (error) {
					console.error("authorize:", error);
					return null;
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user }) {
			// user существует только при успешном входе
			if (user) {
				token.id = String(user.id);
			}

			return token;
		},

		async session({ session, token }) {
			if (session.user && token.id) {
				session.user.id = String(token.id);
			}

			return session;
		},
	},
});

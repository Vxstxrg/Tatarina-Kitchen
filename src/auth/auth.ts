import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "@/schema/zod"
// Your own logic for dealing with plaintext password strings; be careful!

import { getUserFromDb } from "@/utils/user"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/utils/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				email: { label: "Email", type: 'email', },
				password: { label: "Password", type: 'password' },
			},
			authorize: async (credentials) => {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error("Missing credentials.")
					}

					const { email, password } = await signInSchema.parseAsync(credentials)





					const user = await getUserFromDb(email)

					if (!user || !user.password) {
						throw new Error("Неверный ввод данных.")
					}

					const isPasswordValid = await bcrypt.compare(password, user.password)

					if (!isPasswordValid) {
						throw new Error("Неверный ввод данных.")
					}


					return {
						id: user.id,
						email: user.email,
					}
				} catch (error) {
					if (error instanceof ZodError) {
						return null
					}
					return null
				}
			},
		}),
	],

	session: {
		strategy: "jwt",
		maxAge: 3600,
	},
	secret: process.env.AUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		}
	}
});
import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { saltAndHashPassword } from "./password";

describe("saltAndHashPassword", () => {
	it("возвращает bcrypt-хеш, а не исходный пароль", async () => {
		const hash = await saltAndHashPassword("secret123");

		expect(hash).not.toBe("secret123");
		expect(hash.startsWith("$2")).toBe(true);
	});

	it("хеши одинаковых паролей различаются из-за соли", async () => {
		const first = await saltAndHashPassword("secret123");
		const second = await saltAndHashPassword("secret123");

		expect(first).not.toBe(second);
	});

	it("хеш проходит проверку bcrypt.compare", async () => {
		const hash = await saltAndHashPassword("secret123");

		await expect(bcrypt.compare("secret123", hash)).resolves.toBe(true);
		await expect(bcrypt.compare("wrong-password", hash)).resolves.toBe(false);
	});
});

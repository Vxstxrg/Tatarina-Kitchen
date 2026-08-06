import { PrismaClient } from "./src/generated/prisma/client"; // Импортируем прямо из файла client
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const createExtendedClient = () => {
	// Явно передаем URL из .env в конструктор, как этого требует Prisma 7 для Accelerate
	const dbUrl = process.env.DATABASE_URL || "";
	if (dbUrl.startsWith("prisma+")) {
		// Prisma Accelerate URL
		return new PrismaClient({ accelerateUrl: dbUrl }).$extends(withAccelerate());
	}

	const adapter = new PrismaPg({ connectionString: dbUrl });
	return new PrismaClient({ adapter }).$extends(withAccelerate());
};

type ExtendedPrismaClient = ReturnType<typeof createExtendedClient>;

const globalForPrisma = globalThis as unknown as {
	prisma: ExtendedPrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createExtendedClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

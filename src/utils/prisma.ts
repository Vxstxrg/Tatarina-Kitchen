import { PrismaClient } from "../generated/prisma/client"; // Путь изменен на вашу кастомную папку (точечный импорт файла клиента)
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const createExtendedClient = () => {
	// Явно передаем URL в конструктор, так как это необходимо для Prisma 7+
	const dbUrl = process.env.DATABASE_URL || "";
	if (dbUrl.startsWith("prisma+")) {
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

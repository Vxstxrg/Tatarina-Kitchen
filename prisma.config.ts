// Конфиг Prisma CLI (используется командами generate / db push).
// Здесь нельзя импортировать сгенерированный клиент — только окружение.
import "dotenv/config";
import path from "node:path";

export default {
	schema: path.join("prisma", "schema.prisma"),
	datasource: {
		url: process.env.DATABASE_URL,
	},
} as const;

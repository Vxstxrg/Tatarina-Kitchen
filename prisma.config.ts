import "dotenv/config";
import { defineConfig } from "prisma/config"; // Убрали импорт env

export default defineConfig({
	schema: "prisma/schema.prisma",

	migrations: {
		path: "prisma/migrations",
	},

	datasource: {
		// Используем стандартный process.env вместо хелпера env()
		url: process.env.DATABASE_URL || "postgresql://mock:mock@localhost:5432/mock",
	},
});

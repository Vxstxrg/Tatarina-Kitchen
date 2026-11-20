import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		await prisma.$queryRaw`SELECT 1`;

		return NextResponse.json({ status: "ok", database: "up" });
	} catch (error) {
		console.error("health check:", error);

		return NextResponse.json(
			{ status: "degraded", database: "down" },
			{ status: 503 },
		);
	}
}

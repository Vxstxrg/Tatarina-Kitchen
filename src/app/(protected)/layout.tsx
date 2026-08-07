import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface ProtectedLayoutProps {
	children: ReactNode;
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
	const session = await auth();

	if (!session?.user?.id) {
		redirect("/error?message=Недостаточно%20прав");
	}

	return <>{children}</>;
}

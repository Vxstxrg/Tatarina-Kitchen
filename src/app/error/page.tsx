"use client"

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";

function ErrorContent() {
	const searchParams = useSearchParams();
	const message = searchParams.get("message") || "Неизвестная ошибка";

	return (
		<div className="flex flex-col justify-center items-center gap-4 py-16">
			<p className='!text-red-500 text-xl text-center'>{message}</p>
			<Link href="/">
				<Button variant="primary">На главную</Button>
			</Link>
		</div>
	);
}

export default function ErrorPage() {
	return (
		<Suspense fallback={<p className="text-center py-16 text-[var(--text)]">Загрузка...</p>}>
			<ErrorContent />
		</Suspense>
	);
}

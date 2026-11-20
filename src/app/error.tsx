"use client";

import { Button } from "@heroui/react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	console.error(error);

	return (
		<section className="flex h-full w-full flex-col items-center justify-center gap-4 py-16">
			<h1 className="text-5xl font-bold text-[var(--text)]">Что-то пошло не так</h1>
			<p className="text-[var(--text)]">
				Произошла непредвиденная ошибка. Попробуйте ещё раз.
			</p>
			<Button variant="primary" onPress={() => reset()}>
				Повторить
			</Button>
		</section>
	);
}

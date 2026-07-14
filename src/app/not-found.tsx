import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound() {
	return (
		<section className="flex h-full w-full flex-col items-center justify-center gap-4 py-10">
			<h1 className="text-7xl font-bold text-[var(--text)]" >404</h1>
			<p className='text-[var(--text)]'>Страница не найдена</p>

			<Link href="/">
				<Button variant="primary">
					Вернуться на главную
				</Button>
			</Link>
		</section>
	);
}
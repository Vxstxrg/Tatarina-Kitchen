"use client"
import RecipeForm from '@/forms/recipe.form';
import { layoutConfig } from '@/config/layout.config';

export default function NewRecipePage() {
	// Берем высоту хедера из конфигурации, если она задана числом или строкой
	const headerHeight = layoutConfig.header.height || "64px";

	return (
		// Используем calc(100vh - headerHeight), чтобы занять только оставшееся пространство
		// Заменяем justify-center на pt-12 (или pt-8), чтобы прижать форму ближе к хедеру
		<div
			style={{ minHeight: `calc(100vh - ${headerHeight})` }}
			className='w-full flex flex-col items-center pt-12 p-4 bg-background'
		>
			<div className='flex flex-col items-center w-full max-w-[450px]'>
				<h1 className='text-3xl font-bold mb-6 text-center'>Создать новый рецепт</h1>
				<RecipeForm />
			</div>
		</div>
	);
}

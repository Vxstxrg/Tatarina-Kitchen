"use client"

import * as React from 'react';
import RecipeForm from '@/forms/recipe.form';
import { useRecipeStore } from '@/store/recipe.store';
import { layoutConfig } from '@/config/layout.config';

// В Next.js 16 параметры страницы передаются строго как Promise
interface PageProps {
	params: Promise<{ id: string }>;
}

// Шаблон для вывода сообщений по центру экрана.
// Объявлен вне компонента страницы, чтобы не пересоздаваться на каждом рендере
function FullScreenMessage({ children }: { children: React.ReactNode }) {
	const headerHeight = layoutConfig.header.height || "64px";

	return (
		<div
			style={{ minHeight: `calc(100vh - ${headerHeight})` }}
			className='w-full flex items-center justify-center p-4 bg-background text-[var(--text)]'
		>
			{children}
		</div>
	);
}

export default function EditRecipePage({ params }: PageProps) {
	// Асинхронно разворачиваем параметры роута по спецификации Next.js 16
	const unwrappedParams = React.use(params);
	const id = unwrappedParams?.id ? String(unwrappedParams.id) : '';

	const { recipes, isLoading, isLoaded, error, loadRecipes } = useRecipeStore();

	// Подгружаем рецепты с бэкенда, если ещё не загружали (например, при F5)
	React.useEffect(() => {
		if (!isLoaded) {
			loadRecipes();
		}
	}, [isLoaded, loadRecipes]);

	// Искомый рецепт выводим напрямую из стора — без дублирования в useState
	const recipe = recipes.find((r) => String(r.id) === id) ?? null;

	if (isLoading || !isLoaded) {
		return <FullScreenMessage><p className='text-center text-xl'>Загрузка рецепта...</p></FullScreenMessage>;
	}

	if (error) {
		return <FullScreenMessage><p className='text-red-500 text-center text-xl'>{error}</p></FullScreenMessage>;
	}

	// Если загрузка прошла, но такого рецепта в базе нет
	if (!recipe) {
		return (
			<FullScreenMessage>
				<div className="text-center">
					<p className='text-red-500 text-xl font-bold mb-2'>Рецепт не найден</p>
					<p className="text-xs text-gray-500 max-w-xs break-all">ID: {id}</p>
				</div>
			</FullScreenMessage>
		);
	}

	const headerHeight = layoutConfig.header.height || "64px";

	return (
		<div
			style={{ minHeight: `calc(100vh - ${headerHeight})` }}
			className='w-full flex flex-col items-center pt-12 pb-16 p-4 bg-background text-[var(--text)]'
		>
			<div className='flex flex-col items-center w-full max-w-[450px]'>
				<h1 className='text-3xl font-bold mb-6 text-center'>
					Редактировать: {recipe.name}
				</h1>
				<RecipeForm initialRecipe={recipe} />
			</div>
		</div>
	);
}

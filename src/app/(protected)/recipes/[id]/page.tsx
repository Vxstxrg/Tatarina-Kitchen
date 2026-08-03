"use client"

import * as React from 'react';
import RecipeForm from '@/forms/recipe.form';
import { useRecipeStore } from '@/store/recipe.store';
import { IRecipe } from '@/types/recipe';
import { layoutConfig } from '@/config/layout.config';

// В Next.js 16 параметры страницы передаются строго как Promise
interface PageProps {
	params: Promise<{ id: string }>;
}

export default function EditRecipePage({ params }: PageProps) {
	// Асинхронно разворачиваем параметры роута по спецификации Next.js 16
	const unwrappedParams = React.use(params);
	const id = unwrappedParams?.id ? String(unwrappedParams.id) : '';

	const { recipes, isLoading, error, loadRecipes } = useRecipeStore();
	const [recipe, setRecipe] = React.useState<IRecipe | null>(null);
	const [isReady, setIsReady] = React.useState(false);

	const headerHeight = layoutConfig.header.height || "64px";

	// 1. Подгружаем рецепты с бэкенда в Zustand, если массив пуст (например, при F5)
	React.useEffect(() => {
		if (recipes.length === 0) {
			loadRecipes();
		}
	}, [recipes.length, loadRecipes]);

	// 2. Ищем нужный рецепт в массиве по UUID
	React.useEffect(() => {
		if (!isLoading) {
			const foundRecipe = recipes.find((r) => String(r.id) === id);
			setRecipe(foundRecipe || null);
			setIsReady(true);
		} else {
			setIsReady(false);
		}
	}, [recipes, id, isLoading]);

	// Шаблон для вывода сообщений по центру экрана
	const FullScreenMessage = ({ children }: { children: React.ReactNode }) => (
		<div
			style={{ minHeight: `calc(100vh - ${headerHeight})` }}
			className='w-full flex items-center justify-center p-4 bg-background text-[var(--text)]'
		>
			{children}
		</div>
	);

	// Отображение процесса загрузки данных
	if (isLoading || !isReady) {
		return <FullScreenMessage><p className='text-center text-xl'>Загрузка рецепта...</p></FullScreenMessage>;
	}

	// Отображение ошибки бэкенда
	if (error) {
		return <FullScreenMessage><p className='text-red-500 text-center text-xl'>{error}</p></FullScreenMessage>;
	}

	// Если загрузка прошла, но такого UUID в вашей базе рецептов нет
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

	// Успешный рендеринг формы редактирования
	return (
		<div
			style={{ minHeight: `calc(100vh - ${headerHeight})` }}
			// pt-12 аккуратно прижимает форму ближе к хедеру, pb-16 делает отступ от footer
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

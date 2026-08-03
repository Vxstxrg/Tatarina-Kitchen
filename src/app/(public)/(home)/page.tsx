"use client"

import { useRecipeStore } from '@/store/recipe.store';
import { Button, Link } from '@heroui/react';
import RecipeCard from '@/components/common/recipe-card';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
	const { recipes, isLoading, error } = useRecipeStore();
	const { isAuth } = useAuthStore();

	return (
		<>
			{isAuth ? (
				<div className='flex w-full justify-center items-center mb-4'>
					{/* Оптимизированный синтаксис ссылки для HeroUI */}
					<Button as={Link} href="/recipes/new" variant='primary'>
						Добавить рецепт
					</Button>
				</div>
			) : (
				<h1 className='text-center text-4xl font-bold !text-red-700 mb-6'>
					Пожалуйста, зарегистрируйтесь
				</h1>
			)}

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			{isLoading && <p>Загрузка...</p>}

			{/* Добавлен класс mb-16 для отступа сетки от футера */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'>
				{/* Безопасный рендеринг: проверяем наличие recipe и recipe.id */}
				{recipes && recipes.map((recipe) => (
					recipe?.id ? <RecipeCard key={recipe.id} recipe={recipe} /> : null
				))}
			</div>
		</>
	);
}

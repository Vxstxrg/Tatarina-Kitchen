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
					<Link href="/recipes/new">
						<Button variant='primary'>Добавить рецепт</Button>
					</Link>
				</div>
			) : (
				<p className='text-center text-[var(--text-muted)] mb-6'>
					Войдите или зарегистрируйтесь, чтобы добавлять рецепты
				</p>
			)}

			{error && <p className='text-red-500 mb-4'>{error}</p>}

			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="h-[480px] rounded-xl bg-[var(--surface)] animate-pulse"
						/>
					))}
				</div>
			)}

			{!isLoading && !error && recipes.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-16 mb-16 text-center">
					<p className="text-xl text-[var(--text)]">Рецептов пока нет</p>
					<p className="text-sm text-[var(--text-muted)]">
						{isAuth
							? "Станьте первым — добавьте рецепт татарской кухни"
							: "Рецепты появятся после входа"}
					</p>
				</div>
			)}

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16'>
				{recipes && recipes.map((recipe) => (
					recipe?.id ? <RecipeCard key={recipe.id} recipe={recipe} /> : null
				))}
			</div>
		</>
	);
}

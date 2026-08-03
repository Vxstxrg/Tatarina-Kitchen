"use client"

import { IRecipe } from '@/types/recipe';
import { Card, Button } from "@heroui/react";
import { useRecipeStore } from '@/store/recipe.store';
import Link from 'next/link';
import { useTransition } from 'react';
import Image from 'next/image';
import { UNIT_ABBREVIATIONS } from '@/constants/select-options';

interface RecipeCardProps {
	recipe: IRecipe;
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
	const { removeRecipe } = useRecipeStore();
	const [isPending, startTransition] = useTransition();

	const handleDelete = () => {
		startTransition(async () => {
			try {
				await removeRecipe(recipe.id);
			} catch (error) {
				console.error("Ошибка при удалении рецепта", error);
			}
		});
	};

	const getUnitLabel = (unit: string) => {
		const unitOption = UNIT_ABBREVIATIONS.find(
			(option) => option.value === unit
		);
		return unitOption ? unitOption.label : unit.toLowerCase();
	};

	return (
		// Изменено: bg-[var(--surface)] вместо стандартного белого фона карточки
		<Card className="w-full max-w-md h-[480px] flex flex-col bg-[var(--surface)] border border-gray-800 rounded-xl shadow-lg ">
			{/* Изображение рецепта */}
			<div className="h-48 overflow-hidden">
				{recipe.imageUrl ? (
					<div className="relative h-48 group overflow-hidden rounded-t-xl border-b border-gray-800">
						<Image
							src={recipe.imageUrl}
							alt="image for recipe"
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				) : (
					// Изменено: темный фон-заглушка вместо bg-gray-200
					<div className="w-full h-full bg-[#21262d] flex items-center justify-center rounded-t-xl border-b border-gray-800">
						<span className="text-gray-400">Нет изображения</span>
					</div>
				)}
			</div>

			{/* Изменено: убран text-black, добавлен text-[var(--text)] */}
			<Card.Header className="flex justify-between items-center text-[var(--text)] px-4 pt-4">
				{/* Изменено: убран !text-white, заголовок теперь наследует основной цвет текста темы */}
				<Card.Title className="text-xl font-bold text-[var(--text)]">{recipe.name}</Card.Title>
			</Card.Header>

			{/* Изменено: убран text-black, применен цвет темы и серый оттенок для описания */}
			<Card.Content className="flex-1 text-[var(--text)] px-4 py-2">
				<p className="text-gray-400 text-sm line-clamp-4">
					{recipe.description || "Без описания"}
				</p>

				<h3 className="mt-4 font-semibold text-[var(--primary)] text-sm">Ингредиенты:</h3>
				{/* Изменено: кастомный скроллбар и стилизация под темную тему */}
				<ul className="flex flex-col gap-1.5 mt-2 overflow-y-auto max-h-24 pr-1 list-none">
					{recipe.ingredients.map((ing) => (
						// Изменено: убраны дефолтные li стили, добавлен аккуратный темный фон для строк ингредиентов
						<li key={ing.id} className="bg-[#21262d] px-3 py-1.5 rounded-lg border-l-2 border-[var(--primary)] text-xs flex justify-between">
							<strong className="text-[var(--text)] font-medium">{ing.ingredient?.name}</strong>
							<span className="text-gray-400">
								{ing.quantity} {getUnitLabel(ing.ingredient?.unit)}
							</span>
						</li>
					))}
				</ul>
			</Card.Content>

			{/* Панель управления кнопками */}
			<div className="flex justify-end gap-2 p-4 border-t border-gray-800">
				<Link href={`/recipes/${recipe.id}`}>
					{/* Изменено: использование основного цвета темы для кнопки редактирования */}
					<Button variant="flat" className="bg-[#21262d] text-[var(--primary)] hover:bg-[#30363d]">
						Редактировать
					</Button>
				</Link>
				<Button
					variant="danger-soft"
					onPress={handleDelete}
					isPending={isPending}
					className="bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-900/50"
				>
					Удалить
				</Button>
			</div>
		</Card>
	);
};

export default RecipeCard;

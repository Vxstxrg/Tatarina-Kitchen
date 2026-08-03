"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';
import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';
import { Table, Button } from '@heroui/react';

const IngredientsTable = () => {
	const { ingredients, removeIngredient, isLoading } = useIngredientStore();
	const { isAuth } = useAuthStore();

	const handleDelete = async (id: string) => {
		await removeIngredient(id);
	};

	const getCategoryLabel = (value: string) => {
		const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
		return option ? option.label : value;
	};

	const getUnitLabel = (value: string) => {
		const option = UNIT_OPTIONS.find((opt) => opt.value === value);
		return option ? option.label : value;
	};

	if (isLoading) {
		return <p className="mt-4 text-[var(--text)]">Загрузка...</p>;
	}

	if (!isAuth) {
		return <p className="mt-4 text-[var(--text)]">Пожалуйста, авторизуйтесь для просмотра таблицы.</p>;
	}

	return (
		/* Изменен общий фон таблицы на --surface, убраны светлые тени и бордеры */
		<Table className="mt-4 border border-[#30363d] bg-[var(--surface)] rounded-xl overflow-hidden shadow-none">
			<Table.ScrollContainer>
				<Table.Content aria-label="Список ингредиентов">

					{/* Изменен фон шапки таблицы на --header, цвет текста на --text */}
					<Table.Header className="bg-[var(--header)] border-b border-[#30363d]">
						<Table.Column className="p-3 text-left font-semibold text-[var(--text)]">Название</Table.Column>
						<Table.Column className="p-3 text-left font-semibold text-[var(--text)]">Категория</Table.Column>
						<Table.Column className="p-3 text-left font-semibold text-[var(--text)]">Ед. изм.</Table.Column>
						<Table.Column className="p-3 text-left font-semibold text-[var(--text)]">Цена за единицу</Table.Column>
						<Table.Column className="p-3 text-left font-semibold text-[var(--text)]">Описание</Table.Column>
						<Table.Column className="p-3 text-right font-semibold text-[var(--text)]">Действия</Table.Column>
					</Table.Header>

					<Table.Body
						renderEmptyState={() => (
							<div className="text-center p-6 text-gray-400">Ингредиенты не найдены</div>
						)}
					>
						{ingredients.map((ingredient) => (
							<Table.Row
								key={ingredient.id}
								id={ingredient.id}
								/* Изменен цвет бордеров строк и эффект наведения hover:bg-[#21262d] */
								className="border-b border-[#30363d] hover:bg-[#21262d] transition-colors"
							>
								{/* Цвет текста ячеек изменен на --text */}
								<Table.Cell className="p-3 text-[var(--text)] font-medium">{ingredient.name}</Table.Cell>
								<Table.Cell className="p-3 text-[var(--text)]">{getCategoryLabel(ingredient.category)}</Table.Cell>
								<Table.Cell className="p-3 text-[var(--text)]">{getUnitLabel(ingredient.unit)}</Table.Cell>
								<Table.Cell className="p-3 text-[var(--text)]">
									{ingredient.pricePerUnit !== null ? `${ingredient.pricePerUnit} ₽` : "—"}
								</Table.Cell>
								{/* Описание сделано чуть приглушенным серо-голубым цветом, подходящим под темную тему */}
								<Table.Cell className="p-3 text-[#8b949e] max-w-xs truncate">
									{ingredient.description || "—"}
								</Table.Cell>
								<Table.Cell className="p-3 text-right">
									<Button
										variant="danger"
										size="sm"
										onPress={() => handleDelete(ingredient.id)}
									>
										Удалить
									</Button>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>

				</Table.Content>
			</Table.ScrollContainer>
		</Table>
	);
};

export default IngredientsTable;

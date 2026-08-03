"use client";

import { useState, useTransition } from "react";
import { Button, Form, Input, Select, ListBox, ListBoxItem, TextField, FieldError } from "@heroui/react";
import { useIngredientStore } from "@/store/ingredient.store";
import { useRecipeStore } from "@/store/recipe.store";
import { IRecipe } from "@/types/recipe";
import { useRouter } from "next/navigation";

interface RecipeFormProps {
	initialRecipe?: IRecipe;
}

interface IIngredientField {
	id: number; // Уникальный инкрементный ID для ключей React
	ingredientId: string;
	quantity: number | null;
}

const initialState = {
	name: "",
	description: "",
	imageUrl: ""
};

const RecipeForm = ({ initialRecipe }: RecipeFormProps) => {
	const [error, setError] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: initialRecipe?.name || initialState.name,
		description: initialRecipe?.description || initialState.description,
		imageUrl: initialRecipe?.imageUrl || initialState.imageUrl
	});

	const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
		initialRecipe?.ingredients
			? initialRecipe.ingredients.map((ing, index) => ({
				id: index,
				ingredientId: ing.ingredientId,
				quantity: ing.quantity
			}))
			: [{ id: 0, ingredientId: "", quantity: null }]
	);

	// Храним счетчик для генерации гарантированно уникальных ID ингредиентов
	const [nextId, setNextId] = useState(
		initialRecipe?.ingredients ? initialRecipe.ingredients.length : 1
	);

	const { ingredients } = useIngredientStore();
	const { addRecipe, updateRecipe } = useRecipeStore();
	const [isPending, startTransition] = useTransition();

	const router = useRouter();

	const handleAddIngredientField = () => {
		if (ingredientFields.length < 10) {
			setIngredientFields([
				...ingredientFields,
				{ id: nextId, ingredientId: "", quantity: null }
			]);
			setNextId((prev) => prev + 1); // Инкрементируем счетчик ID
		}
	};

	const handleRemoveIngredientField = (id: number) => {
		if (ingredientFields.length > 1) {
			setIngredientFields(ingredientFields.filter((field) => field.id !== id));
		}
	};

	const handleIngredientChange = (
		id: number,
		field: keyof IIngredientField,
		value: string | number | null
	) => {
		setIngredientFields(
			ingredientFields.map((f) => (f.id === id ? { ...f, [field]: value } : f))
		);
	};

	const handleSubmit = async (formData: FormData) => {
		startTransition(async () => {
			setError(null);

			const result = initialRecipe
				? await updateRecipe(initialRecipe.id, formData)
				: await addRecipe(formData);

			if (result.success) {
				setIngredientFields([{ id: 0, ingredientId: "", quantity: null }]);
				setNextId(1);
				router.push("/");
				setFormData(initialState);
			} else {
				setError(result.error || "Ошибка при сохранении рецепта");
			}
		});
	};

	return (
		<Form className="w-[450px] flex flex-col gap-4" action={handleSubmit}>
			{error && <p className="text-red-500 mb-2">{error}</p>}

			<TextField 
				isRequired 
				name="name" 
				className="w-full bg-default-100 rounded-xl"
				validate={(value) => (!value ? "Название обязательно" : null)}
			>
				<Input
					placeholder="Введите название рецепта"
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
				/>
				<FieldError className="text-red-500 text-xs mt-1" />
			</TextField>

			<TextField name="description" className="w-full bg-default-100 rounded-xl">
				<Input
					placeholder="Введите описание (необязательно)"
					type="text"
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
				/>
			</TextField>

			<TextField name="imageUrl" className="w-full bg-default-100 rounded-xl">
				<Input
					placeholder="URL изображения (необязательно)"
					type="url"
					value={formData.imageUrl}
					onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
				/>
			</TextField>

			<div className="space-y-2 w-full">
				{ingredientFields.map((field, index) => (
					<div key={field.id} className="flex gap-2 items-start w-full">

						<Select
							isRequired
							name={`ingredient_${index}`}
							placeholder="Выберите ингредиент"
							selectedKeys={field.ingredientId ? new Set([field.ingredientId]) : new Set()}
							className="w-full"
							onSelectionChange={(keys) => {
								if (keys instanceof Set && keys.size > 0) {
									const selectedValue = Array.from(keys)[0];
									handleIngredientChange(field.id, "ingredientId", String(selectedValue));
								}
							}}
						>
							<Select.Trigger className="relative flex min-h-10 items-center px-4 bg-default-100 rounded-xl text-sm w-full">
								<Select.Value className="w-full text-left truncate" />
								<Select.Indicator className="absolute right-4 text-black" />
							</Select.Trigger>
							<Select.Popover className="bg-white border border-default-200 rounded-xl">
								<ListBox>
									{ingredients.map((ingredient) => (
										<ListBoxItem id={ingredient.id} key={ingredient.id} textValue={ingredient.name} className="text-black">
											{ingredient.name}
										</ListBoxItem>
									))}
								</ListBox>
							</Select.Popover>
						</Select>

						<TextField
							isRequired
							name={`quantity_${index}`}
							className="w-[120px] bg-default-100 rounded-xl"
							validate={(value) =>
								!value || parseFloat(value) <= 0
									? "Должно быть > 0"
									: null
							}
						>
							<Input
								placeholder="Кол-во"
								type="number"
								value={field.quantity !== null ? field.quantity.toString() : ""}
								onChange={(e) =>
									handleIngredientChange(
										field.id,
										"quantity",
										e.target.value ? parseFloat(e.target.value) : null
									)
								}
							/>
							<FieldError className="text-red-500 text-xs mt-1" />
						</TextField>

						{ingredientFields.length > 1 && (
							<Button
								variant="danger-soft"
								onPress={() => handleRemoveIngredientField(field.id)}
								className="min-w-[70px] h-10"
							>
								Удалить
							</Button>
						)}
					</div>
				))}

				{ingredientFields.length < 10 && (
					<Button
						variant="secondary"
						onPress={handleAddIngredientField}
						className="mt-2"
					>
						+ Добавить поле
					</Button>
				)}
			</div>

			<div className="flex w-full items-center justify-end mt-4">
				<Button variant="primary" type="submit" isPending={isPending}>
					{initialRecipe ? "Сохранить изменения" : "Добавить рецепт"}
				</Button>
			</div>
		</Form>
	);
};

export default RecipeForm;

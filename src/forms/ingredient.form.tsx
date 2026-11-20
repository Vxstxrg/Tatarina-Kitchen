"use client";

import { useState, useTransition } from "react";
import {
	Button,
	FieldError,
	Input,
	ListBox,
	Select,
	TextArea,
	TextField,
} from "@heroui/react";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/constants/select-options";
import { useIngredientStore } from '@/store/ingredient.store';

interface FormDataState {
	name: string;
	category: string;
	unit: string;
	pricePerUnit: number | null;
	description: string;
}

interface FormErrors {
	name: string;
	category: string;
	unit: string;
	pricePerUnit: string;
}

const initialState: FormDataState = {
	name: "",
	category: "",
	unit: "",
	pricePerUnit: null,
	description: ""
};

const initialErrorState: FormErrors = {
	name: "",
	category: "",
	unit: "",
	pricePerUnit: "",
};

const IngredientForm = () => {
	const [errors, setErrors] = useState<FormErrors>(initialErrorState);
	const [formData, setFormData] = useState<FormDataState>(initialState);
	const [isPending, startTransition] = useTransition();
	const [formResetKey, setFormResetKey] = useState(0);
	const { addIngredient } = useIngredientStore();

	const validateName = (value: string): string => {
		const trimmedValue = value.trim();
		if (!trimmedValue) return "Введите название ингредиента";
		if (trimmedValue.length < 3) return "Минимум 3 символа";
		return "";
	};

	const validatePrice = (value: number | null): string => {
		if (value === null) return "Введите цену";
		if (!Number.isFinite(value)) return "Введите корректную цену";
		if (value <= 0) return "Цена должна быть больше 0";
		return "";
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setFormData((prev) => ({ ...prev, name: value }));
		if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
	};

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;
		const price = inputValue === "" ? null : Number(inputValue);
		setFormData((prev) => ({ ...prev, pricePerUnit: price }));
		if (errors.pricePerUnit) setErrors((prev) => ({ ...prev, pricePerUnit: "" }));
	};

	const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = event.target.value;
		setFormData((prev) => ({ ...prev, description: value }));
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const newErrors: FormErrors = {
			name: validateName(formData.name),
			category: formData.category.trim() ? "" : "Выберите категорию",
			unit: formData.unit ? "" : "Выберите единицу измерения",
			pricePerUnit: validatePrice(formData.pricePerUnit),
		};

		setErrors(newErrors);

		const hasErrors = Object.values(newErrors).some((error) => error !== "");
		if (hasErrors) {
			return;
		}

		startTransition(async () => {
			const isCreated = await addIngredient(formData);

			if (isCreated) {
				setFormData(initialState);
				setErrors(initialErrorState);
				setFormResetKey((prev) => prev + 1);
			}
		});
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full max-w-full flex-col gap-6"
		>
			{/* Поле Название */}
			<TextField
				isRequired
				isInvalid={Boolean(errors.name)}
				validationBehavior="aria"
				fullWidth
				isDisabled={isPending}
				className="group flex flex-col"
			>
				<Input
					name="name"
					type="text"
					placeholder="Введите название ингредиента"
					value={formData.name}
					onChange={handleNameChange}
					className="min-h-14 px-4 text-base border border-[var(--border)] rounded-xl transition-colors bg-[var(--surface)] hover:border-[#3d444d] focus:border-[var(--primary)] focus:outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] group-data-[invalid=true]:border-red-500 group-data-[invalid=true]:text-red-500"
				/>
				<FieldError className="text-red-500 text-sm mt-1">{errors.name}</FieldError>
			</TextField>

			{/* Сетка заменена на grid для исключения горизонтального скролла */}
			<div className="grid grid-cols-3 gap-4 w-full">

				{/* Категория */}
				<Select
					key={`category-${formResetKey}`}
					name="category"
					placeholder="Категория"
					selectedKey={formData.category || null}
					isRequired
					fullWidth
					className="group flex flex-col"
					isInvalid={Boolean(errors.category)}
					validationBehavior="aria"
					onSelectionChange={(key) => {
						if (!key) {
							setFormData((prev) => ({ ...prev, category: "" }));
							return;
						}
						const selectedKey = String(key).trim();
						if (!selectedKey || selectedKey === "null" || selectedKey === "undefined") return;

						setFormData((prev) => ({ ...prev, category: selectedKey }));
						setErrors((prev) => ({ ...prev, category: "" }));
					}}
					isDisabled={isPending}
				>
					<Select.Trigger className="relative flex min-h-14 items-center justify-center px-4 border border-[var(--border)] rounded-xl transition-colors bg-[var(--surface)] hover:border-[#3d444d] focus:border-[var(--primary)] focus:outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] group-data-[invalid=true]:border-red-500 group-data-[invalid=true]:text-red-500">
						<Select.Value className="w-full text-current" />
						<Select.Indicator className="absolute right-4" />
					</Select.Trigger>
					<Select.Popover className="border border-[var(--border)] bg-[var(--surface)] rounded-xl text-[var(--text)]">
						<ListBox>
							{CATEGORY_OPTIONS.map((option) => (
								<ListBox.Item id={option.value} key={option.value} textValue={option.label}>
									{option.label}
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

				{/* Ед. Измерения */}
				<Select
					key={`unit-${formResetKey}`}
					name="unit"
					placeholder="Ед. измерения"
					selectedKey={formData.unit || null}
					isRequired
					fullWidth
					className="group flex flex-col"
					isInvalid={Boolean(errors.unit)}
					validationBehavior="aria"
					onSelectionChange={(key) => {
						if (!key) {
							setFormData((prev) => ({ ...prev, unit: "" }));
							return;
						}
						const selectedKey = String(key).trim();
						if (!selectedKey || selectedKey === "null" || selectedKey === "undefined") return;

						setFormData((prev) => ({ ...prev, unit: selectedKey }));
						setErrors((prev) => ({ ...prev, unit: "" }));
					}}
					isDisabled={isPending}
				>
					<Select.Trigger className="relative flex min-h-14 items-center justify-center px-4 border border-[var(--border)] rounded-xl transition-colors bg-[var(--surface)] hover:border-[#3d444d] focus:border-[var(--primary)] focus:outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] group-data-[invalid=true]:border-red-500 group-data-[invalid=true]:text-red-500">
						<Select.Value className="w-full text-current" />
						<Select.Indicator className="absolute right-4" />
					</Select.Trigger>
					<Select.Popover className="border border-[var(--border)] bg-[var(--surface)] rounded-xl text-[var(--text)]">
						<ListBox>
							{UNIT_OPTIONS.map((option) => (
								<ListBox.Item id={option.value} key={option.value} textValue={option.label}>
									{option.label}
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

				{/* Цена */}
				<TextField
					isRequired
					isInvalid={Boolean(errors.pricePerUnit)}
					validationBehavior="aria"
					fullWidth
					className="group flex flex-col"
					isDisabled={isPending}
				>
					<div className="relative w-full">
						<Input
							name="pricePerUnit"
							type="number"
							min="0.01"
							step="0.01"
							placeholder="Цена"
							value={formData.pricePerUnit === null ? "" : String(formData.pricePerUnit)}
							onChange={handlePriceChange}
							className="min-h-14 w-full pr-10 border border-[var(--border)] rounded-xl transition-colors bg-[var(--surface)] hover:border-[#3d444d] focus:border-[var(--primary)] focus:outline-none text-[var(--text)] placeholder:text-[var(--text-muted)] group-data-[invalid=true]:border-red-500 group-data-[invalid=true]:text-red-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						/>
						<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">₽</span>
					</div>
					<FieldError className="text-red-500 text-sm mt-1">{errors.pricePerUnit}</FieldError>
				</TextField>
			</div>

			{/* Поле Описание */}
			<TextField
				fullWidth
				isDisabled={isPending}
				className="group flex flex-col"
			>
				<TextArea
					name="description"
					placeholder="Описание ингредиента (необязательно)"
					value={formData.description}
					onChange={handleDescriptionChange}
					className="min-h-24 p-4 text-base border border-[var(--border)] rounded-xl bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] hover:border-[#3d444d] focus:border-[var(--primary)] focus:outline-none transition-colors resize-none"
				/>
			</TextField>

			{/* Кнопка добавления */}
			<Button
				type="submit"
				isDisabled={isPending}
				variant="primary"
			className="min-h-12 px-6 self-end rounded-xl font-medium"
			>
				{isPending ? "Добавление..." : "Добавить ингредиент"}
			</Button>
		</form>
	);
};

export default IngredientForm;

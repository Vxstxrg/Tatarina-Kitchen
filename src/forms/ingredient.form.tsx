"use client";

import { useState } from "react";
import {
	Button,
	FieldError,
	Input,
	InputGroup,
	ListBox,
	Select,
	TextArea,
	TextField,
} from "@heroui/react";

import {
	CATEGORY_OPTIONS,
	UNIT_OPTIONS,
} from "@/constants/select-options";

interface FormData {
	name: string;
	category: string;
	unit: string;
	pricePerUnit: number | null;
	description: string;
}

interface FormErrors {
	name: string;
	pricePerUnit: string;
}

const IngredientForm = () => {
	const [errors, setErrors] = useState<FormErrors>({
		name: "",
		pricePerUnit: "",
	});

	const [formData, setFormData] = useState<FormData>({
		name: "",
		category: "",
		unit: "",
		pricePerUnit: null,
		description: "",
	});

	const validateName = (value: string): string => {
		const trimmedValue = value.trim();

		if (!trimmedValue) {
			return "Введите название ингредиента";
		}

		if (trimmedValue.length < 3) {
			return "Минимум 3 символа";
		}

		return "";
	};

	const validatePrice = (value: number | null): string => {
		if (value === null) {
			return "Введите цену";
		}

		if (!Number.isFinite(value)) {
			return "Введите корректную цену";
		}

		if (value <= 0) {
			return "Цена должна быть больше 0";
		}

		const decimalPart = String(value).split(".")[1];

		if (decimalPart && decimalPart.length > 2) {
			return "Укажите не больше двух знаков после запятой";
		}

		return "";
	};

	const handleNameChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = event.target.value;

		setFormData((prev) => ({
			...prev,
			name: value,
		}));

		if (errors.name) {
			setErrors((prev) => ({
				...prev,
				name: "",
			}));
		}
	};

	const handlePriceChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const inputValue = event.target.value;

		const price =
			inputValue === ""
				? null
				: Number(inputValue);

		setFormData((prev) => ({
			...prev,
			pricePerUnit: price,
		}));

		if (errors.pricePerUnit) {
			setErrors((prev) => ({
				...prev,
				pricePerUnit: "",
			}));
		}
	};

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();

		const nameError = validateName(formData.name);
		const priceError = validatePrice(formData.pricePerUnit);

		setErrors({
			name: nameError,
			pricePerUnit: priceError,
		});

		if (nameError || priceError) {
			return;
		}

		console.log("Отправленные данные:", formData);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex w-full max-w-[700px] flex-col gap-6"
		>
			<TextField
				name="name"
				isRequired
				isInvalid={Boolean(errors.name)}
				fullWidth
			>
				<Input
					type="text"
					placeholder="Введите название ингредиента"
					value={formData.name}
					onChange={handleNameChange}
					className="min-h-14 px-4 text-base"
				/>

				<FieldError>{errors.name}</FieldError>
			</TextField>

			<div className="flex w-full gap-4">
				<Select
					name="category"
					placeholder="Категория"
					value={formData.category || null}
					onChange={(value) => {
						const category =
							typeof value === "string"
								? value
								: String(value ?? "");

						setFormData((prev) => ({
							...prev,
							category,
						}));
					}}
					isRequired
					fullWidth
					className="w-1/3"
				>
					<Select.Trigger className="relative flex min-h-14 items-center justify-center px-4">
						<Select.Value className="w-full " />
						<Select.Indicator className="absolute right-4" />
					</Select.Trigger>

					<Select.Popover>
						<ListBox>
							{CATEGORY_OPTIONS.map((option) => (
								<ListBox.Item
									id={option.value}
									key={option.value}
									textValue={option.label}
								>
									{option.label}
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

				<Select
					name="unit"
					placeholder="Ед. измерения"
					value={formData.unit || null}
					onChange={(value) => {
						const unit =
							typeof value === "string"
								? value
								: String(value ?? "");

						setFormData((prev) => ({
							...prev,
							unit,
						}));
					}}
					isRequired
					fullWidth
					className="w-1/3"
				>
					<Select.Trigger className="relative flex min-h-14 items-center justify-center px-4">
						<Select.Value className="w-full " />
						<Select.Indicator className="absolute right-4" />
					</Select.Trigger>

					<Select.Popover>
						<ListBox>
							{UNIT_OPTIONS.map((option) => (
								<ListBox.Item
									id={option.value}
									key={option.value}
									textValue={option.label}
								>
									{option.label}
								</ListBox.Item>
							))}
						</ListBox>
					</Select.Popover>
				</Select>

				<TextField
					name="pricePerUnit"
					isRequired
					isInvalid={Boolean(errors.pricePerUnit)}
					fullWidth
					className="w-1/3 min-w-0"
				>
					<div className="relative w-full">
						<Input
							type="number"
							min="0.01"
							step="0.01"
							placeholder="Цена"
							value={
								formData.pricePerUnit === null
									? ""
									: String(formData.pricePerUnit)
							}
							onChange={handlePriceChange}
							className="min-h-14 w-full pr-10 [appearance:textfield]  [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
						/>

						<span
							className="pointer-events-none  absolute right-3 top-1/2 -z-0 -translate-y-1/2 text-default-500 "
						>
							₽
						</span>
					</div>

					<FieldError>{errors.pricePerUnit}</FieldError>
				</TextField>
				
			</div>


			<TextField name="description" fullWidth>
				<TextArea
					placeholder="Описание ингредиента"
					value={formData.description}
					onChange={(event) => {
						setFormData((prev) => ({
							...prev,
							description: event.target.value,
						}));
					}}
					className="min-h-12 px-4 py-3 text-base"
				/>
			</TextField>

			<div className="flex w-full justify-end">
				<Button type="submit" className="min-h-12 px-6">
					Добавить ингредиент
				</Button>
			</div>
		</form>
	);
};

export default IngredientForm;
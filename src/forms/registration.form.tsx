"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { registerUser } from "@/actions/register";
import { signInWithCredentials } from "@/actions/sign-in";

interface IProps {
	onClose: () => void;
}

interface FormData {
	email: string;
	password: string;
	confirmPassword: string;
}

interface FormErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
}

export default function RegistrationForm({ onClose }: IProps) {
	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [serverError, setServerError] = useState<string | null>(null);
	const inputErrorClassName =
		"border border-red-500 bg-red-50 text-red-900 placeholder:text-red-400";

	const handleChange =
		(field: keyof FormData) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setFormData((prev) => ({
					...prev,
					[field]: e.target.value,
				}));
				setServerError(null);

				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			};

	const validate = () => {
		const newErrors: FormErrors = {};

		if (!formData.email) {
			newErrors.email = "Введите Email";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Некорректный Email";
		}

		if (!formData.password) {
			newErrors.password = "Введите пароль";
		} else if (formData.password.length < 6) {
			newErrors.password = "Минимум 6 символов";
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Повторите пароль";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Пароли не совпадают";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validate()) return;
		setServerError(null);

		const result = await registerUser(formData);
		if (!result.success) {
			setServerError(result.error || "Ошибка регистрации");
			return;
		}

		const signInResult = await signInWithCredentials(formData.email, formData.password);
		if (!signInResult.success) {
			setServerError(signInResult.message);
			return;
		}

		window.location.reload();
		onClose();
	};

	return (
		<form noValidate className="flex w-full flex-col gap-5" onSubmit={handleSubmit}>
			<div className="w-full">

				<Input
					type="email"
					value={formData.email}
					onChange={handleChange("email")}
					placeholder="Введите Email"
					aria-invalid={Boolean(errors.email)}
					className={`w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-900
		placeholder:text-gray-500
		hover:bg-gray-200
		focus:bg-gray-100
		focus:outline-none
		${errors.email ? inputErrorClassName : ""}
	`}
				/>

				{errors.email && (
					<p className="mt-1 text-sm text-red-500">
						{errors.email}
					</p>
				)}
			</div>

			<div>

				<Input
					type="password"
					value={formData.password}
					onChange={handleChange("password")}
					placeholder="Введите пароль"
					aria-invalid={Boolean(errors.password)}
					className={`w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-900
		placeholder:text-gray-500
		hover:bg-gray-200
		focus:bg-gray-100
		focus:outline-none
		${errors.password ? inputErrorClassName : ""}
	`}
				/>

				{errors.password && (
					<p className="mt-1 text-sm text-red-500">
						{errors.password}
					</p>
				)}
			</div>

			<div>

				<Input
					type="password"
					value={formData.confirmPassword}
					onChange={handleChange("confirmPassword")}
					placeholder="Повторите пароль"
					aria-invalid={Boolean(errors.confirmPassword)}
					className={`w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-900
		placeholder:text-gray-500
		hover:bg-gray-200
		focus:bg-gray-100
		focus:outline-none
		${errors.confirmPassword ? inputErrorClassName : ""}
	`}
				/>

				{errors.confirmPassword && (
					<p className="mt-1 text-sm text-red-500">
						{errors.confirmPassword}
					</p>
				)}
			</div>

			<div className="mt-4 flex justify-end gap-3">
				<Button variant="ghost" onPress={onClose}>
					Отмена
				</Button>

				<Button variant="primary" type="submit">
					Зарегистрироваться
				</Button>
			</div>
			{serverError && <p className="text-sm text-red-500">{serverError}</p>}
		</form>
	);
}
"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { signInWithCredentials } from "@/actions/sign-in";

interface IProps {
	onClose: () => void;
}

interface LoginData {
	email: string;
	password: string;
}

interface LoginErrors {
	email?: string;
	password?: string;
}

export default function LoginForm({ onClose }: IProps) {
	const [formData, setFormData] = useState<LoginData>({
		email: "",
		password: "",
	});
	const [authError, setAuthError] = useState<string | null>(null);

	const [errors, setErrors] = useState<LoginErrors>({});
	const inputErrorClassName =
		"border border-red-500 bg-red-50 text-red-900 placeholder:text-red-400";

	const handleChange =
		(field: keyof LoginData) =>
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setFormData((prev) => ({
					...prev,
					[field]: e.target.value,
				}));
				setAuthError(null);

				// Убираем ошибку после изменения поля
				setErrors((prev) => ({
					...prev,
					[field]: undefined,
				}));
			};

	const validate = () => {
		const newErrors: LoginErrors = {};

		if (!formData.email) {
			newErrors.email = "Введите Email";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Некорректный Email";
		}

		if (!formData.password) {
			newErrors.password = "Введите пароль";
		}

		setErrors(newErrors);

		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validate()) return;
		const result = await signInWithCredentials(formData.email, formData.password);
		if (!result.success) {
			setAuthError(result.message);
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

			<div className="w-full">


				<Input
					type="password"
					placeholder="Введите пароль"
					value={formData.password}
					onChange={handleChange("password")}
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

			<div className="mt-4 flex justify-end gap-3">
				<Button variant="ghost" onPress={onClose}>
					Отмена
				</Button>

				<Button variant="primary" type="submit">
					Войти
				</Button>
			</div>
			{authError && <p className="text-sm text-red-500">{authError}</p>}
		</form>
	);
}
import { createIngredient, deleteIngredient, getIngredients } from '@/actions/ingredient';
import { IIngredient } from '@/types/ingredient';
import { create } from 'zustand';

const getErrorMessage = (value: unknown, fallback: string) =>
	typeof value === "string" ? value : fallback;

interface IngredientState {
	ingredients: IIngredient[];
	isLoading: boolean;
	error: string | null;
	loadIngredients: () => Promise<void>;
	addIngredient: (formData: unknown) => Promise<void>;
	removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
	ingredients: [],
	isLoading: false,
	error: null,


	loadIngredients: async () => {
		set({ isLoading: true, error: null });
		try {
			const result = await getIngredients()
			if (result.success && result.ingredients) {
				set({ ingredients: result.ingredients, isLoading: false })
			}
			else {
				const message = "error" in result
					? getErrorMessage(result.error, "Ошибка при загрузке ингредиентов")
					: "Ошибка при загрузке ингредиентов";
				set({ error: message, isLoading: false })
			}
		} catch (error) {
			console.log("error", error);
			set({ error: "Ошибка при загрузке ингредиентов", isLoading: false })
		}
	},

	addIngredient: async (formdata: unknown) => {
		set({ isLoading: true, error: null });
		try {
			const result = await createIngredient(formdata)

			if (result.success && result.ingredient) {
				set((state) => ({
					ingredients: [...state.ingredients, result.ingredient],
					isLoading: false
				}));
			} else {
				const message = "error" in result
					? getErrorMessage(result.error, "Ошибка при добавлении ингредиента")
					: "Ошибка при добавлении ингредиента";
				set({ error: message, isLoading: false })
			}
		} catch (error) {
			console.log("error", error);
			set({ error: "Ошибка при получении ингредиентов", isLoading: false })
		}
	},

	removeIngredient: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const result = await deleteIngredient(id);


			if (result.success) {
				set((state) => ({
					ingredients: state.ingredients.filter(
						(ingredient) => ingredient.id !== id
					),
					isLoading: false
				}))
			}
			else {
				const message = "error" in result
					? getErrorMessage(result.error, "Ошибка при удалении ингредиента")
					: "Ошибка при удалении ингредиента";
				set({ error: message, isLoading: false })
			}

		} catch (error) {
			console.log("error", error);
			set({ error: "Ошибка при удалении ингредиента", isLoading: false })
		}
	}
}));

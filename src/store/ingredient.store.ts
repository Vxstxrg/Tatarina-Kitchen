import {
	createIngredient,
	deleteIngredient,
	getIngredients,
} from "@/actions/ingredient";
import { IIngredient } from "@/types/ingredient";
import { create } from "zustand";

interface IngredientState {
	ingredients: IIngredient[];
	isLoading: boolean;
	error: string | null;
	loadIngredients: () => Promise<void>;
	addIngredient: (formData: unknown) => Promise<boolean>;
	removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
	ingredients: [],
	isLoading: false,
	error: null,

	loadIngredients: async () => {
		set({ isLoading: true, error: null });
		try {
			const result = await getIngredients();
			if (result.success) {
				set({ ingredients: result.data, isLoading: false });
			} else {
				set({ error: result.error, isLoading: false });
			}
		} catch (error) {
			console.error("loadIngredients:", error);
			set({ error: "Ошибка при загрузке ингредиентов", isLoading: false });
		}
	},

	addIngredient: async (formData) => {
		set({ isLoading: true, error: null });
		try {
			const result = await createIngredient(formData);

			if (result.success) {
				set((state) => ({
					ingredients: [...state.ingredients, result.data],
					isLoading: false,
				}));
				return true;
			}

			set({ error: result.error, isLoading: false });
			return false;
		} catch (error) {
			console.error("addIngredient:", error);
			set({ error: "Ошибка при добавлении ингредиента", isLoading: false });
			return false;
		}
	},

	removeIngredient: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const result = await deleteIngredient(id);

			if (result.success) {
				set((state) => ({
					ingredients: state.ingredients.filter(
						(ingredient) => ingredient.id !== id,
					),
					isLoading: false,
				}));
			} else {
				set({ error: result.error, isLoading: false });
			}
		} catch (error) {
			console.error("removeIngredient:", error);
			set({ error: "Ошибка при удалении ингредиента", isLoading: false });
		}
	},
}));

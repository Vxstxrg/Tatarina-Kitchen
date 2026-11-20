import {
	createRecipe,
	deleteRecipe,
	getRecipes,
	updateRecipe as updateRecipeAction,
} from "@/actions/recipe";
import { IRecipe } from "@/types/recipe";
import { create } from "zustand";

interface IActionResult {
	success: boolean;
	recipe?: IRecipe;
	error?: string;
}

interface IRecipeState {
	recipes: IRecipe[];
	isLoading: boolean;
	/** true после первой успешной (пусть и пустой) загрузки списка */
	isLoaded: boolean;
	error: string | null;
	loadRecipes: () => Promise<void>;
	addRecipe: (formData: FormData) => Promise<IActionResult>;
	updateRecipe: (id: string, formData: FormData) => Promise<IActionResult>;
	removeRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<IRecipeState>((set) => ({
	recipes: [],
	isLoading: false,
	isLoaded: false,
	error: null,

	loadRecipes: async () => {
		set({ isLoading: true, error: null });
		try {
			const result = await getRecipes();
			if (result.success) {
				set({ recipes: result.data, isLoaded: true, isLoading: false });
			} else {
				set({
					error: result.error,
					recipes: [],
					isLoaded: true,
					isLoading: false,
				});
			}
		} catch (error) {
			console.error("loadRecipes:", error);
			set({
				error: "Ошибка при загрузке рецептов",
				recipes: [],
				isLoaded: true,
				isLoading: false,
			});
		}
	},

	addRecipe: async (formData) => {
		set({ isLoading: true, error: null });

		try {
			const result = await createRecipe(formData);
			if (result.success) {
				set((state) => ({
					recipes: [...state.recipes, result.data],
					isLoading: false,
				}));
				return { success: true, recipe: result.data };
			}

			set({ error: result.error, isLoading: false });
			return { success: false, error: result.error };
		} catch (error) {
			console.error("addRecipe:", error);
			set({ error: "Ошибка при добавлении рецепта", isLoading: false });
			return { success: false, error: "Ошибка при добавлении рецепта" };
		}
	},

	updateRecipe: async (id, formData) => {
		set({ isLoading: true, error: null });

		try {
			const result = await updateRecipeAction(id, formData);
			if (result.success) {
				set((state) => ({
					recipes: state.recipes.map((recipe) =>
						recipe && recipe.id === id ? result.data : recipe,
					),
					isLoading: false,
				}));
				return { success: true, recipe: result.data };
			}

			set({ error: result.error, isLoading: false });
			return { success: false, error: result.error };
		} catch (error) {
			console.error("updateRecipe:", error);
			set({ error: "Ошибка при обновлении рецепта", isLoading: false });
			return { success: false, error: "Ошибка при обновлении рецепта" };
		}
	},

	removeRecipe: async (id) => {
		set({ isLoading: true, error: null });

		try {
			const result = await deleteRecipe(id);

			if (result.success) {
				set((state) => ({
					recipes: state.recipes.filter((recipe) => recipe && recipe.id !== id),
					isLoading: false,
				}));
			} else {
				set({ error: result.error, isLoading: false });
			}
		} catch (error) {
			console.error("removeRecipe:", error);
			set({ error: "Ошибка при удалении рецепта", isLoading: false });
		}
	},
}));

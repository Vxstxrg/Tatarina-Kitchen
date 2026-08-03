import {
	createRecipe,
	deleteRecipe,
	getRecipes,
	updateRecipe as updateRecipeAction
} from '@/actions/recipe';
import { IRecipe } from '@/types/recipe';
import { create } from 'zustand';

interface IActionResult {
	success: boolean;
	recipe?: IRecipe;
	error?: string;
}

interface IRecipeState {
	recipes: IRecipe[];
	isLoading: boolean;
	error: string | null;
	loadRecipes: () => Promise<void>;
	addRecipe: (formData: FormData) => Promise<IActionResult>;
	updateRecipe: (id: string, formData: FormData) => Promise<IActionResult>;
	removeRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<IRecipeState>((set) => ({
	recipes: [],
	isLoading: false,
	error: null,

	loadRecipes: async () => {
		set({ isLoading: true, error: null });
		try {
			const result = await getRecipes();
			if (result.success && Array.isArray(result.recipes)) {
				// ИСПРАВЛЕНО: гарантируем, что в стейт попадёт только массив. Никаких строк!
				set({ recipes: result.recipes, isLoading: false });
			} else {
				set({
					error: result.error || "Не удалось загрузить рецепты",
					recipes: [], // Защита: сбрасываем в пустой массив при ошибке
					isLoading: false
				});
			}
		} catch (error) {
			console.error("error", error);
			set({ error: "Ошибка при загрузке рецептов", recipes: [], isLoading: false });
		}
	},

	addRecipe: async (formData: FormData) => {
		set({ isLoading: true, error: null });

		try {
			const result = await createRecipe(formData);
			if (result.success && result.recipe) {
				set((state) => ({
					recipes: [...state.recipes, result.recipe!],
					isLoading: false
				}));
				return { success: true, recipe: result.recipe };
			} else {
				set({ error: result.error || "Не удалось добавить рецепт", isLoading: false });
				return { success: false, error: result.error || "Не удалось добавить рецепт" };
			}
		} catch (error) {
			console.error("error", error);
			set({ error: "Ошибка при добавлении рецепта", isLoading: false });
			return { success: false, error: "Ошибка при добавлении рецепта" };
		}
	},

	updateRecipe: async (id: string, formData: FormData) => {
		set({ isLoading: true, error: null });

		try {
			const result = await updateRecipeAction(id, formData);
			if (result.success && result.recipe) {
				set((state) => ({
					recipes: state.recipes.map((recipe) =>
						recipe && recipe.id === id ? result.recipe! : recipe
					),
					isLoading: false
				}));
				return { success: true, recipe: result.recipe };
			} else {
				set({ error: result.error || "Не удалось обновить рецепт", isLoading: false });
				return { success: false, error: result.error || "Не удалось обновить рецепт" };
			}
		} catch (error) {
			console.error("error", error);
			set({ error: "Ошибка при обновлении рецепта", isLoading: false });
			return { success: false, error: "Ошибка при обновлении рецепта" };
		}
	},

	removeRecipe: async (id: string) => {
		set({ isLoading: true, error: null });

		try {
			const result = await deleteRecipe(id);

			if (result?.success) {
				set((state) => ({
					recipes: state.recipes.filter((recipe) => recipe && recipe.id !== id),
					isLoading: false
				}));
			} else {
				set({ error: result?.error || "Не удалось удалить рецепт", isLoading: false });
			}
		} catch (error) {
			console.error("error", error);
			set({ error: "Ошибка при удалении рецептов", isLoading: false });
		}
	},
}));

import IngredientsTable from '@/components/UI/layout/tables/ingredients';
import IngredientForm from "@/forms/ingredient.form";

const IngredientsPage = () => {
	return (
		<div className="min-h-screen flex flex-col items-center overflow-y-hidden">
			<h1 className="mt-8 text-3xl font-bold text-[var(--text)]">
				Добавление ингредиента
			</h1>

			<div className="min-h-screen max-w-full overflow-x-hidden flex flex-col items-center bg-[var(--background)] pb-12">
				<div className="w-full max-w-3xl bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><IngredientForm /></div>
				<IngredientsTable />
			</div>
		</div>
	);
};

export default IngredientsPage;

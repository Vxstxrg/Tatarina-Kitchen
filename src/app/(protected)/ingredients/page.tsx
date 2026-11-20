import IngredientsTable from '@/components/UI/layout/tables/ingredients';
import IngredientForm from "@/forms/ingredient.form";

const IngredientsPage = () => {
	return (
		<div className="flex w-full flex-col items-center pb-12">
			<section className="w-full max-w-3xl bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl">
				<h2 className="text-xl font-semibold text-[var(--text)] mb-6">
					Новый ингредиент
				</h2>
				<IngredientForm />
			</section>

			<div className="w-full mt-8">
				<IngredientsTable />
			</div>
		</div>
	);
};

export default IngredientsPage;

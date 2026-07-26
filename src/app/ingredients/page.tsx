import IngredientForm from "@/forms/ingredient.form";

const IngredientsPage = () => {
	return (
		<div className="min-h-screen flex flex-col items-center overflow-y-hidden">
			<h1 className="mt-8 text-3xl font-bold text-[var(--text)]">
				Добавление ингредиента
			</h1>

			<div className="mt-8 flex w-full justify-center">
				<IngredientForm />
			</div>
		</div>
	);
};

export default IngredientsPage;
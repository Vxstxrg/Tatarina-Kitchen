"use client";
import { useAuthStore } from "@/store/auth.store";
import { useIngredientStore } from '@/store/ingredient.store';
import { useRecipeStore } from '@/store/recipe.store';
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
	children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
	const { data: authSession, status: authStatus } = useSession();
	const { loadIngredients } = useIngredientStore();
	const { loadRecipes } = useRecipeStore()
	const { isAuth, setAuthState } = useAuthStore();
	useEffect(() => {
		setAuthState(authStatus, authSession);
	}, [authStatus, authSession, setAuthState]);

	useEffect(() => {
		if (isAuth) {
			loadIngredients()
		}
	}, [isAuth, loadIngredients]);

	useEffect (()=>{
		loadRecipes();
	}, [loadRecipes]);

	return <>{children}</>;
};

export default AppLoader;
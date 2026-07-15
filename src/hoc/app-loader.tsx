"use client";
import { useAuthStore } from "@/store/auth.store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface IProps {
	children: React.ReactNode;
}

const AppLoader = ({ children }: IProps) => {
	const { data: authSession, status: authStatus } = useSession();

	const { setAuthState } = useAuthStore();

	useEffect(() => {
		setAuthState(authStatus, authSession);
	}, [authStatus, authSession, setAuthState]);

	return <>{children}</>;
};

export default AppLoader;
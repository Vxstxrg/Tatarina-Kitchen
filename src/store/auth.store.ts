import { create } from "zustand";
import type { Session } from "next-auth";
import type { SessionStatus } from "next-auth/react";

interface AuthState {
	isAuth: boolean;
	status: SessionStatus;
	session: Session | null;
	setAuthState: (
		status: SessionStatus,
		session: Session | null
	) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuth: false,
	status: "loading",
	session: null,

	setAuthState: (status, session) =>
		set({
			isAuth: status === "authenticated",
			status,
			session,
		}),
}));
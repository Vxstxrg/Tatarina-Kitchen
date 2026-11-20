"use client";
import "./header.css";
import Link from "next/link";
import { Button } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";
import { layoutConfig } from '@/config/layout.config';
import RegistrationModal from "@/components/UI/modals/registration.modal";
import LoginModal from "@/components/UI/modals/login.modal";
import { useState } from "react";
import { signOutFunc } from "@/actions/sign-out";
import { useAuthStore } from "@/store/auth.store";


export const Logo = () => {
	return (<Image src="/logo.png" alt={siteConfig.title} width={50} height={50} priority />);
}


export default function Header() {

	const pathname = usePathname();

	const { isAuth, session, status, setAuthState } = useAuthStore();

	const [isRegisterOpen, setIsRegisterOpen] = useState(false);
	const [isLoginOpen, setIsLoginOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOutFunc();
		} catch (error) {
			console.error('Error signing out:', error);
		}

		setAuthState('unauthenticated', null);
	}

	const renderNavItems = () => {
		return siteConfig.navItems
			.filter((item) => {
				if (item.href === "/ingredients") {
					return isAuth;
				}
				return true;
			})
			.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={`inline-flex h-full items-center whitespace-nowrap ${isActive ? "text-[var(--primary)]" : "text-[var(--text)]"}
							hover:text-[var(--primary)] border-b-2 border-transparent hover:border-[var(--primary)] rounded-md
							transition-colors duration-300
							`}
					>
						{item.label}
					</Link>
				);
			});
	}


	return (
		<nav
			className="border-b border-[var(--border)]"
			style={{
				height: layoutConfig.header.height,
				backgroundColor: layoutConfig.header.backgroundColor,
			}}
		>
			{/* Три зоны во flex-потоке: логотип / навигация / пользователь.
				Абсолютное позиционирование навигации убрано — оно накладывалось на правый блок */}
			<div className="w-full max-w-[1024px] mx-auto h-full flex items-center gap-4 px-4 sm:px-6">
				<div className="flex flex-1 items-center">
					<Link href="/" className="flex h-full items-center">
						<div className="flex items-center gap-3">
							<Logo />
							<span className="text-xl font-bold text-[var(--text)] hidden sm:inline">
								{siteConfig.title}
							</span>
						</div>
					</Link>
				</div>

				<div className="flex items-center gap-4 sm:gap-6">
					{renderNavItems()}
				</div>

				<div className="flex flex-1 items-center justify-end gap-3 min-w-0">
					{/* Длинный email обрезается многоточием, а не наезжает на навигацию */}
					{isAuth && (
						<p className="hidden md:inline text-[var(--text)] max-w-[180px] truncate">
							Привет, {session?.user?.name || session?.user?.email}!
						</p>
					)}
					{status === 'loading' ? <p className='text-[var(--text)]'>Загрузка...</p> : !isAuth ? <> <Button
						variant="secondary"
						className="min-w-24"
						onPress={() => setIsLoginOpen(true)}>
						Логин
					</Button>
						<Button
							variant="primary"
							className="min-w-24"
							onPress={() => setIsRegisterOpen(true)}>
							Регистрация
						</Button></> : <><Button
							variant="secondary"
							className="min-w-24"
							onPress={handleSignOut}>
							Выйти
						</Button></>}
				</div>
			</div>


			<RegistrationModal
				isOpen={isRegisterOpen}
				onClose={() => setIsRegisterOpen(false)}
			/>

			<LoginModal
				isOpen={isLoginOpen}
				onClose={() => setIsLoginOpen(false)}
			/>
		</nav>
	);
}

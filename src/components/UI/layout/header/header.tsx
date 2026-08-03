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
	return (<Image src="/logo.png" alt="${siteConfig.title}" width={50} height={50} priority />);
}



export default function Header() {

	const pathname = usePathname();

	const { isAuth, session, status, setAuthState } = useAuthStore();




	console.log('session', session);
	console.log('status', status);
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

	const getNavItemClassName = () => {
		return (siteConfig.navItems
			.filter((item)=>{
			if(item.href === "/ingredients"){
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
					className={`inline-flex h-full items-center ${isActive ? "text-blue-500" : "text-white"}
						hover:text-blue-300 border-b-2 border-transparent hover:border-blue-300 rounded-md
						transition-colors 
						transition-border duration-300
						`}
				>
					{item.label}
				</Link>
			);
		}))
	}


	return (
		<nav
			style={{
				height: layoutConfig.header.height,
				backgroundColor: layoutConfig.header.backgroundColor,
			}}
		>
			<div className="w-full max-w-[1024px] mx-auto h-full flex items-center justify-between gap-6 px-6 relative">
				<Link href="/" className="flex h-full items-center text-xl font-bold">
					<div className="flex items-center justify-center gap-3">
						<Logo />
						<span className="text-xl font-bold text-[var(--text)]"> {siteConfig.title}</span>
					</div>
				</Link>

				<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div className="flex items-center gap-6 pointer-events-auto">
						{getNavItemClassName()}


					</div>
				</div>

				<div className="flex items-center gap-3">
					{isAuth && <p className='text-white'> Привет, {session?.user?.name || session?.user?.email}! </p>}
					{status === 'loading' ? <p className='text-white'>Загрузка...</p> : !isAuth ? <> <Button
						variant="secondary"
						className="min-w-24"
						as={Link}
						href="#"
						onPress={() => setIsLoginOpen(true)}>
						Логин
					</Button>
						<Button
							variant="primary"
							className="min-w-24"
							as={Link}
							href="#"
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
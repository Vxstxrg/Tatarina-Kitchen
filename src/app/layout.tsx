
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/header/header";
import { Provider } from "@/provider/provider";
import { siteConfig } from "@/config/site.config";
import { layoutConfig } from '@/config/layout.config';
import { auth } from "@/auth/auth";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: siteConfig.title,
	description: siteConfig.description,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth()
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-screen flex flex-col">

				<Provider>
					<SessionProvider session={session}>
						<Header />
						<main className="flex-1 w-full">
							{children}
						</main>
						<footer className={`bg-[${layoutConfig.footer.backgroundColor}] text-[${layoutConfig.footer.textColor}] h-[${layoutConfig.footer.height}] flex justify-center items-center `}>
							<p>{siteConfig.description}</p>
						</footer>
					</SessionProvider>
				</Provider>


			</body>
		</html>
	);
}

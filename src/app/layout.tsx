import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/components/UI/layout/header/header";
import Title from "@/components/UI/layout/title/title";
import AppLoader from "@/hoc/app-loader";

import { Provider } from "@/provider/provider";
import { siteConfig } from "@/config/site.config";
import { layoutConfig } from "@/config/layout.config";

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
	const session = await auth();

	return (
		<html
			lang="ru"
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
		>
			<body className="min-h-screen flex flex-col">
				<Provider>
					<SessionProvider session={session}>
						<AppLoader>
							<Header />

							<div className="w-full max-w-[1024px] mx-auto px-6">
								<Title />
								<main className="min-h-0 flex-1 overflow-hidden">
									{children}
								</main>
							</div>

							<footer
								className="mt-auto flex items-center justify-center"
								style={{
									backgroundColor:
										layoutConfig.footer.backgroundColor,
									color: layoutConfig.footer.textColor,
									height: layoutConfig.footer.height,
								}}
							>
								<div className="w-full max-w-[1024px] mx-auto px-6 text-center">
									<p>{siteConfig.description}</p>
								</div>
							</footer>
						</AppLoader>
					</SessionProvider>
				</Provider>
			</body>
		</html>
	);
}
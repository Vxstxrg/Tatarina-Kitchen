"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site.config";

const Title = () => {
	const pathname = usePathname();

	const currentNavItem = siteConfig.navItems.find(
		(item) => item.href === pathname
	);

	const pageTitle = currentNavItem?.label ?? siteConfig.title;

	return (
		<div className="w-full py-6">
			<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
				{pageTitle}
			</h1>
		</div>
	);
};

export default Title;
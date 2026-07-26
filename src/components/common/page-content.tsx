"use client"

import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site.config';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';
const PageContent = () => {
	const pathname = usePathname();
	const pageContent = siteConfig.pageContent[pathname as keyof typeof siteConfig.pageContent];

	if (!pageContent) {
		return <div>Страница не найдена</div>;
	}

	const cleanHTML = DOMPurify.sanitize(pageContent.content)

	return (<div>{parse(cleanHTML)}</div>);
}
export default PageContent;
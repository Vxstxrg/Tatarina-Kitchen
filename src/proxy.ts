import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

// 1. Изменили имя функции с middleware на proxy для Next.js 16
export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
	const token = await getToken({
		req: request,
		secret: authSecret,
	});
	const protectedRoutes = ["/ingredients", "/recipes/new", "/recipes/:path*"];

	if (protectedRoutes.some((route) => pathname.startsWith(route.replace(":path", "")))) {
		if (!token) {
			// 2. Исправили формирование URL редиректа через безопасное клонирование nextUrl
			const url = request.nextUrl.clone();
			url.pathname = "/error";
			url.searchParams.set("message", "Недостаточно прав");
			return NextResponse.redirect(url);
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/ingredients", "/recipes/new", "/recipes/:path*"],
};

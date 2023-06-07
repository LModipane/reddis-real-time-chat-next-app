import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	// Manage route protection
	const isAuth = await getToken({ req });
	const isLoginPage = pathname.startsWith('/login');

	const sensitiveRoutes = ['/chats'];
	const isAccessingSensitiveRoute = sensitiveRoutes.some(route =>
		pathname.startsWith(route),
	);

	if (isLoginPage) {
		if (isAuth) {
			return NextResponse.redirect(new URL('/chats', req.url));
		}
		return NextResponse.next();
	}

	if (!isAuth && isAccessingSensitiveRoute) {
		return NextResponse.redirect(new URL('/login', req.url));
	}

	if (pathname === '/') {
		return NextResponse.redirect(new URL('/chats', req.url));
	}
}

export const config = {
	matchter: ['/', '/login', '/chats/:path*'],
};

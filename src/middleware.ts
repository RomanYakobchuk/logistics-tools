import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/auth/login', '/auth/logout', '/api'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = pathname.startsWith('/krews');
    const isPublicRoute = publicPaths.some(path => pathname.startsWith(path));

    if (!isProtectedRoute || isPublicRoute) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/krews/:path*',
        '/auth',
        '/auth/login'
    ],
};
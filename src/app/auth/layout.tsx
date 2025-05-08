'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (isAuthenticated && pathname === '/auth/login') {
            const redirectPath = searchParams.get('redirect') || '/krews/dashboard';
            router.push(redirectPath);
        }
    }, [isAuthenticated, router, pathname, searchParams]);

    return (
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full">
                {children}
            </div>
        </div>
    );
}
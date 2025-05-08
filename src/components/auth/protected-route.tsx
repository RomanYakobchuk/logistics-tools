'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import SessionExpiredModal from './session-expired-modal';

interface ProtectedRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({
                                           children,
                                           adminOnly = false
                                       }: ProtectedRouteProps) {
    const { isAuthenticated, isSystemAdmin, isSessionExpired } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // If not authenticated, redirect to login
        if (!isAuthenticated && !isSessionExpired) {
            router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
        }

        // If admin-only route but user is not admin
        if (adminOnly && !isSystemAdmin) {
            router.push('/krews/dashboard');
        }
    }, [isAuthenticated, isSystemAdmin, adminOnly, router, pathname, isSessionExpired]);

    // If session expired, show session expired modal
    if (isSessionExpired) {
        return <SessionExpiredModal />;
    }

    // If loading or not authenticated, don't render children
    if (!isAuthenticated) {
        return null;
    }

    // If admin-only but user is not admin, don't render children
    if (adminOnly && !isSystemAdmin) {
        return null;
    }

    // Otherwise, render children
    return <>{children}</>;
}
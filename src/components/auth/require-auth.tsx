'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import SessionExpiredModal from './session-expired-modal';

interface RequireAuthProps {
    children: ReactNode;
    adminOnly?: boolean;
}

export default function RequireAuth({
                                        children,
                                        adminOnly = false
                                    }: RequireAuthProps) {
    const { isAuthenticated, isSystemAdmin, isSessionExpired } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (!isAuthenticated && !isSessionExpired) {
            const currentPath = window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
        } else if (adminOnly && !isSystemAdmin) {
            router.push('/krews/dashboard');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, isSystemAdmin, adminOnly, router, isSessionExpired]);

    if (isSessionExpired) {
        return <SessionExpiredModal />;
    }

    if (isChecking) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (adminOnly && !isSystemAdmin) {
        return null;
    }

    return <>{children}</>;
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function LogoutPage() {
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        logout();
        setTimeout(() => {
            router.push('/auth/login');
        }, 100);
    }, [logout, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="mb-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Logging out...</p>
        </div>
    );
}
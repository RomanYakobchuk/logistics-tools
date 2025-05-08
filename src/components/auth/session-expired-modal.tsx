'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function SessionExpiredModal() {
    const router = useRouter();
    const { logout } = useAuth();

    const handleRedirectToLogin = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-[90%] sm:max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">Session Expired</h2>
                    <p className="mb-6 text-center text-gray-600">
                        Your session has expired due to inactivity. Please log in again to continue working.
                    </p>
                    <button
                        onClick={handleRedirectToLogin}
                        className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Return to login page
                    </button>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useEffect } from 'react';
import RequireAuth from '@/components/auth/require-auth';
import PhoneNumberSearch from "@/components/krews/numbers/SearchNumbers";

export default function PhoneNumbersPage() {
    useEffect(() => {
        document.title = 'Phone Numbers | Krews';
    }, []);

    return (
        <RequireAuth>
            <div className="p-6 pb-0 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
                    <p className="text-gray-600 mt-1">
                        Search and manage available phone numbers for your company
                    </p>
                </div>

                <PhoneNumberSearch />
            </div>
        </RequireAuth>
    );
}
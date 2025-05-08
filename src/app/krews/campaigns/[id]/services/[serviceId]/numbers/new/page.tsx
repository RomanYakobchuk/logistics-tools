'use client';

import RequireAuth from '@/components/auth/require-auth';
import PhoneNumberPurchaseWizard from "@/components/krews/numbers/PhoneNumberPurchaseWizard";


export default function ConnectSendersToService() {
    return (
        <RequireAuth>
            <div className="max-w-7xl mx-auto">
                <PhoneNumberPurchaseWizard />
            </div>
        </RequireAuth>
    );
}
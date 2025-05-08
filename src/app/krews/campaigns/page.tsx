'use client';

import {useEffect} from 'react';
import RequireAuth from '@/components/auth/require-auth';
import CampaignsList from '@/components/krews/campaigns/CampaignsList';

export default function CampaignsPage() {
    useEffect(() => {
        document.title = 'SMS Campaigns | Krews';
    }, []);

    return (
        <RequireAuth>
            <div className="p-6 pb-0 max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">SMS Campaigns</h1>
                    <p className="text-gray-600 mt-1">
                        Manage and monitor your SMS messaging campaigns
                    </p>
                </div>

                <CampaignsList/>
            </div>
        </RequireAuth>
    );
}
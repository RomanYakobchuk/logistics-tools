// src/app/krews/campaigns/[campaignId]/numbers/page.tsx (оновлена)
'use client';

import { useState, useEffect } from 'react';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { getCampaignNumbers } from '@/lib/api/sms-service';
import { ICampaignNumbers } from '@/interfaces/sms';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LoadingErrorState, {EmptyState} from '@/components/krews/numbers/LoadingErrorState';
import PhoneNumbersStats from '@/components/krews/numbers/PhoneNumbersStat';
import PhoneNumbersTable from "@/components/krews/numbers/PhoneNumbersTable";

export default function CampaignNumbersPage() {
    const router = useRouter();
    const { campaign, isLoading: campaignLoading } = useCampaign();
    const [numbersData, setNumbersData] = useState<ICampaignNumbers | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'attached' | 'unattached'>('all');

    useEffect(() => {
        if (campaign) {
            fetchNumbers();
        }
    }, [campaign]);

    const fetchNumbers = async () => {
        if (!campaign) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await getCampaignNumbers(campaign.friendlyName);
            setNumbersData(data);
            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error fetching campaign numbers:', err);
            setError(err.message || 'Failed to load phone numbers');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredNumbers = numbersData?.items.filter(number => {
        if (filter === 'all') return true;
        if (filter === 'attached') return number.attached;
        if (filter === 'unattached') return !number.attached;
        return true;
    }) || [];

    const loadingState = <LoadingErrorState isLoading={campaignLoading || isLoading} error={error} onRetry={fetchNumbers} />;

    if (loadingState && (campaignLoading || isLoading || error)) {
        return loadingState;
    }

    if (!numbersData) {
        return (
            <EmptyState message="Unable to load phone numbers for this campaign.">
                <button
                    onClick={fetchNumbers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Try Again
                </button>
            </EmptyState>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-2">
                <button
                    onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}`)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to campaign
                </button>
            </div>

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Phone Numbers</h1>
                    <p className="text-gray-600 mt-1">
                        Manage phone numbers for {campaign?.friendlyName}
                    </p>
                </div>
                <Link
                    href={`/krews/campaigns/${campaign?.friendlyName}/numbers/add`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Number
                </Link>
            </div>

            {/* Stats Cards */}
            <PhoneNumbersStats type="campaign" stats={{ stats: numbersData.stats }} />

            {/* Filter and Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {filteredNumbers.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <p className="text-gray-600">No phone numbers match your current filter.</p>
                    </div>
                ) : (
                    <PhoneNumbersTable
                        numbers={filteredNumbers}
                        campaignName={campaign?.friendlyName || ''}
                    />
                )}
            </div>
        </div>
    );
}
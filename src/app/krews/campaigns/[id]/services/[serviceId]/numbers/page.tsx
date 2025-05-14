'use client';

import { useState, useEffect } from 'react';
import { useService } from '@/lib/campaign/service-context';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { getServiceNumbers } from '@/lib/api/sms-service';
import { IServiceNumbers } from '@/interfaces/sms';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import LoadingErrorState, {EmptyState} from "@/components/krews/numbers/LoadingErrorState";
import PhoneNumbersStats from '@/components/krews/numbers/PhoneNumbersStat';
import PhoneNumbersTable from "@/components/krews/numbers/PhoneNumbersTable";

export default function ServiceNumbersPage() {
    const router = useRouter();
    const { service, isLoading: serviceLoading } = useService();
    const { campaign, isLoading: campaignLoading } = useCampaign();
    const [numbersData, setNumbersData] = useState<IServiceNumbers | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (campaign && service) {
            fetchNumbers();
        }
    }, [campaign, service]);

    const fetchNumbers = async () => {
        if (!campaign || !service) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await getServiceNumbers(campaign.friendlyName, service.sid);
            setNumbersData(data);
            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error fetching service numbers:', err);
            setError(err.message || 'Failed to load phone numbers');
        } finally {
            setIsLoading(false);
        }
    };

    const loadingState = <LoadingErrorState
        isLoading={campaignLoading || serviceLoading || isLoading}
        error={error}
        onRetry={fetchNumbers}
    />;

    if (loadingState && (campaignLoading || serviceLoading || isLoading || error)) {
        return loadingState;
    }

    if (!numbersData) {
        return (
            <EmptyState message="Unable to load phone numbers for this service.">
                <button
                    onClick={fetchNumbers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Try Again
                </button>
            </EmptyState>
        );
    }

    if (numbersData.items.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to service
                    </button>
                </div>

                <EmptyState message="This service doesn't have any phone numbers attached yet.">
                    <Link
                        href={`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers/add`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Phone Number
                    </Link>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center mb-2">
                <button
                    onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}`)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to service
                </button>
            </div>

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Phone Numbers</h1>
                    <p className="text-gray-600 mt-1">
                        Phone numbers for {service?.friendlyName}
                    </p>
                </div>
                <Link
                    href={`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers/add`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Number
                </Link>
            </div>

            {/* Service Info Card */}
            <PhoneNumbersStats
                type="service"
                stats={{
                    count: numbersData.count,
                    service: numbersData.service
                }}
            />

            {/* Numbers Table */}
            <PhoneNumbersTable
                numbers={numbersData.items}
                campaignName={campaign?.friendlyName || ''}
                serviceId={service?.sid}
            />
        </div>
    );
}
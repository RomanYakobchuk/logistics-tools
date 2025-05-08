'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import RequireAuth from '@/components/auth/require-auth';
import {getCampaignServices} from '@/lib/api/sms-service';
import ServicesTable from '@/components/krews/services/ServicesTable';
import {IService} from '@/interfaces/sms';

export default function CampaignServicesPage() {
    const router = useRouter();
    const params = useParams();
    const campaignId = params.id as string;

    const [services, setServices] = useState<IService[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (campaignId) {
            fetchServices();
        }
    }, [campaignId]);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await getCampaignServices(campaignId);
            setServices(data.items || []);
            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error fetching services:', err);
            setError(err.message || 'Failed to load services');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddServiceClick = () => {
        router.push(`/krews/campaigns/${campaignId}/services/new`);
    };


    return (
        <RequireAuth>
            <div className="w-full">

                {error && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <button
                            onClick={() => router.push(`/krews/campaigns/${campaignId}`)}
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
                    <button
                        onClick={handleAddServiceClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Service
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading campaign services...</p>
                    </div>
                ) : services.length > 0 ? (
                    <ServicesTable services={services} campaignId={campaignId}/>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Services Found</h3>
                        <p className="text-gray-600 mb-6">
                            This campaign doesn&apos;t have any SMS services yet. Add your first service to start
                            sending
                            messages.
                        </p>
                        <button
                            onClick={handleAddServiceClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                            </svg>
                            Add Your First Service
                        </button>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
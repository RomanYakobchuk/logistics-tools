"use client";

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useCampaign} from '@/lib/campaign/campaign-context';
import {useService} from '@/lib/campaign/service-context';
import RequireAuth from '@/components/auth/require-auth';

const ServicePage = () => {
    const router = useRouter();
    const {campaign} = useCampaign();
    const {service, isLoading, error} = useService();

    useEffect(() => {
        if (service) {
            document.title = `${service.friendlyName} | Service | Krews`;
        }
    }, [service]);

    const navigateToPhoneNumbers = () => {
        if (campaign && service) {
            router.push(`/krews/campaigns/${campaign.friendlyName}/services/${service.sid}/numbers`);
        }
    };

    const navigateToMessages = () => {
        if (campaign && service) {
            router.push(`/krews/campaigns/${campaign.friendlyName}/services/${service.sid}/messages`);
        }
    };

    const navigateToSendSms = () => {
        if (campaign && service) {
            router.push(`/krews/campaigns/${campaign.friendlyName}/services/${service.sid}/send`);
        }
    };

    return (
        <RequireAuth>
            <div className="py-6 max-w-7xl mx-auto">
                {/* Елегантний інформативний заголовок з іконкою */}
                <div className="mb-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center p-6 border-b border-gray-100">
                        <div className="flex-shrink-0 p-3 mr-4 bg-blue-50 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Manage and monitor your messaging service
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Select an option below to manage your service
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div
                            className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-md mb-6">
                        {error}
                    </div>
                ) : service ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div
                                onClick={navigateToPhoneNumbers}
                                className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-center mb-4">
                                    <div
                                        className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Phone Numbers</h2>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Manage phone numbers associated with this service
                                </p>
                                <button
                                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                                    View phone numbers
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>

                            <div
                                onClick={navigateToMessages}
                                className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-center mb-4">
                                    <div
                                        className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    View message history and status for this service
                                </p>
                                <button
                                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                    View messages
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>

                            <div
                                onClick={navigateToSendSms}
                                className="bg-white rounded-lg shadow-md p-6 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all"
                            >
                                <div className="flex items-center mb-4">
                                    <div
                                        className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600"
                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Send SMS</h2>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Send SMS messages using this service
                                </p>
                                <button
                                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700">
                                    Send a message
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md mb-6">
                        Service not found or loading failed.
                    </div>
                )}
            </div>
        </RequireAuth>
    );
};

export default ServicePage;
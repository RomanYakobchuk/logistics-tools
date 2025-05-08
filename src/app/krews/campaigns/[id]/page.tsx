'use client';

import { useEffect } from 'react';
import { useCampaign } from '@/lib/campaign/campaign-context';
import Link from 'next/link';

export default function PhoneNumbersHubPage() {
    const { campaign, isLoading } = useCampaign();

    useEffect(() => {
        if (campaign) {
            document.title = `Phone Numbers - ${campaign.friendlyName} | Krews`;
        }
    }, [campaign]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading...</p>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Campaign Not Found</h3>
                <p className="text-gray-600">Unable to load campaign details.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Phone Number Management</h1>
                <p className="text-gray-600 mt-1">
                    Choose how you want to view phone numbers for {campaign.friendlyName}
                </p>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campaign Numbers Card */}
                <Link href={`/krews/campaigns/${campaign.friendlyName}/numbers`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-transparent hover:border-blue-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <h2 className="text-lg font-semibold text-gray-900">View All Campaign Numbers</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    See all phone numbers in this campaign, including attached and unattached numbers
                                </p>
                            </div>
                            <div className="ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-3 rounded-md">
                                <div className="text-xs text-blue-600 font-medium">Overview</div>
                                <div className="text-sm text-blue-900 mt-1">Campaign-wide</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-md">
                                <div className="text-xs text-green-600 font-medium">Benefits</div>
                                <div className="text-sm text-green-900 mt-1">Full statistics</div>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-md">
                                <div className="text-xs text-purple-600 font-medium">Filtering</div>
                                <div className="text-sm text-purple-900 mt-1">Advanced options</div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Services Card */}
                <Link href={`/krews/campaigns/${campaign.friendlyName}/services`}>
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer border border-transparent hover:border-blue-500">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4 flex-1">
                                <h2 className="text-lg font-semibold text-gray-900">View by Services</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Explore services and view phone numbers assigned to each
                                </p>
                            </div>
                            <div className="ml-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            <div className="bg-green-50 p-3 rounded-md">
                                <div className="text-xs text-green-600 font-medium">Service View</div>
                                <div className="text-sm text-green-900 mt-1">Organized</div>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-md">
                                <div className="text-xs text-blue-600 font-medium">Context</div>
                                <div className="text-sm text-blue-900 mt-1">Use case based</div>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-md">
                                <div className="text-xs text-yellow-600 font-medium">Management</div>
                                <div className="text-sm text-yellow-900 mt-1">Focused control</div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/krews/campaigns/${campaign.friendlyName}/numbers/new`}
                        className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Purchase New Number
                    </Link>

                    <Link
                        href={`/krews/campaigns/${campaign.friendlyName}/services/new`}
                        className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Service
                    </Link>

                    <Link
                        href={`/krews/campaigns/${campaign.friendlyName}/settings`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Campaign Settings
                    </Link>
                </div>
            </div>
        </div>
    );
}
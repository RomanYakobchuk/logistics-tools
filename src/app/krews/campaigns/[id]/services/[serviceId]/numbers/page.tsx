'use client';

import { useState, useEffect } from 'react';
import { useService } from '@/lib/campaign/service-context';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { getServiceNumbers } from '@/lib/api/sms-service';
import { IServiceNumbers } from '@/interfaces/sms';
import Link from 'next/link';

export default function ServiceNumbersPage() {
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
            const data = await getServiceNumbers(campaign.sid, service.sid);
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

    if (campaignLoading || serviceLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading phone numbers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Numbers</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={fetchNumbers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!numbersData) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
                <p className="text-gray-600">Unable to load phone numbers for this service.</p>
            </div>
        );
    }

    if (numbersData.items.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Phone Numbers</h3>
                <p className="text-gray-600 mb-4">This service doesn&apos;t have any phone numbers attached yet.</p>
                <Link
                    href={`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers/new`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Phone Number
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Service Phone Numbers</h1>
                    <p className="text-gray-600 mt-1">
                        Phone numbers for {service?.friendlyName}
                    </p>
                </div>
                <Link
                    href={`/krews/campaigns/${campaign?.sid}/services/${service?.sid}/numbers/add`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Number
                </Link>
            </div>

            {/* Service Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Total Numbers</h3>
                            <div className="text-2xl font-semibold text-gray-900">{numbersData.count}</div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Service Use Case</h3>
                            <div className="text-lg font-medium text-gray-900 capitalize">
                                {service?.useCase || service?.friendlyName}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <div className="text-lg font-medium text-gray-900">
                                All numbers active
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Numbers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Active Phone Numbers</h2>
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone Number
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capabilities
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Added
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {numbersData.items.map((number) => (
                            <tr key={number.sid}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{number.friendlyName}</div>
                                            <div className="text-sm text-gray-500">{number.phoneNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {number.locality ? `${number.locality}, ` : ''}{number.region}
                                    </div>
                                    <div className="text-sm text-gray-500">{number.countryCode}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {number.capabilities.sms && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    SMS
                                                </span>
                                        )}
                                        {number.capabilities.mms && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    MMS
                                                </span>
                                        )}
                                        {number.capabilities.voice && (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Voice
                                                </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(number.dateCreated).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <Link
                                        href={`/krews/campaigns/${campaign?.sid}/services/${service?.sid}/numbers/${number.sid}`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
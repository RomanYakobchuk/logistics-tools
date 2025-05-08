'use client';

import Image from 'next/image';
import { CompanyBaseInfo } from '@/lib/api/types/auth-types';
import { ICampaign } from '@/interfaces/sms';

interface CompanyInfoCardProps {
    company: CompanyBaseInfo | null;
    campaign: ICampaign | null;
    isLoading: boolean;
}

export default function CompanyInfoCard({ company, campaign, isLoading }: CompanyInfoCardProps) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
                <div className="flex items-start space-x-4">
                    <div className="rounded-md bg-gray-200 h-14 w-14"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!company) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Campaign Info</h3>
            <div className="flex items-start">
                <div className="flex-shrink-0 h-14 w-14 bg-gray-100 rounded-md overflow-hidden">
                    {company.logo ? (
                        <Image
                            src={company.logo}
                            alt={company.name || company.id}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">
                                {company.name || 'Unnamed Company'}
                            </h4>
                            <p className="text-sm text-gray-500">
                                ID: {company.id}
                            </p>
                        </div>
                        {campaign && (
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                campaign.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : campaign.status === 'paused'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                            }`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
                        )}
                    </div>

                    {campaign && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Created: {new Date(campaign.dateCreated).toLocaleDateString()}
                            </div>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Last updated: {new Date(campaign.dateUpdated).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
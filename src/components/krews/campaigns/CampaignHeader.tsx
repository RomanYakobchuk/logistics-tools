'use client';

import { useRouter } from "next/navigation";
import CompanyInfoCard from "@/components/krews/campaigns/CompanyInfoCard";
import {useCampaign} from "@/lib/campaign/campaign-context";

const CampaignHeader = () => {
    const router = useRouter();

    const { campaign, company, isLoading, error } = useCampaign();

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => router.push('/krews/campaigns')}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to campaigns
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Loading...' : campaign?.friendlyName || 'Campaign Details'}
                </h1>
                <p className="text-gray-600 mt-1">
                    Manage SMS services for this campaign
                </p>
            </div>

            {/* Company Info Card */}
            <CompanyInfoCard
                company={company}
                campaign={campaign}
                isLoading={isLoading}
            />

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}
        </>
    );
};

export default CampaignHeader;
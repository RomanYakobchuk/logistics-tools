'use client';

import {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {useService} from "@/lib/campaign/service-context";
import {useCampaign} from "@/lib/campaign/campaign-context";
import CompanyInfoCard from "@/components/krews/campaigns/CompanyInfoCard";

const ServiceHeader = () => {
    const router = useRouter();
    const params = useParams();
    const serviceId = params.serviceId as string;

    const {service, isLoading: serviceLoading, error: serviceError, fetchService} = useService();

    const {campaign, company, isLoading: campaignLoading} = useCampaign();

    useEffect(() => {
        if (serviceId && campaign) {
            fetchService(serviceId);
        }
    }, [serviceId, campaign, fetchService]);

    const isLoading = campaignLoading || serviceLoading;

    return (
        <>
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to services
                    </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isLoading ? 'Loading...' : service?.friendlyName || 'Service Details'}
                </h1>
                <p className="text-gray-600 mt-1">
                    Configure and manage this SMS service
                </p>
                {campaign && (
                    <p className="text-sm text-gray-500 mt-1">
                        for campaign: <span className="font-medium">{campaign.friendlyName}</span>
                    </p>
                )}
            </div>

            {/* Company Info Card - showing campaign info */}
            <div className={'w-full md:max-w-xl'}>
                <CompanyInfoCard
                    company={company}
                    campaign={campaign}
                    isLoading={isLoading}
                />
            </div>

            {serviceError && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                    {serviceError}
                </div>
            )}
        </>
    );
};

export default ServiceHeader;
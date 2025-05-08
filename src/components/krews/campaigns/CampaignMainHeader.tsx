'use client';

import CampaignHeader from "@/components/krews/campaigns/CampaignHeader";
import ServiceHeader from "@/components/krews/campaigns/ServiceHeader";
import {useParams} from "next/navigation";
import {useCampaign} from "@/lib/campaign/campaign-context";
import {useEffect} from "react";

const CampaignMainHeader = () => {

    const params = useParams();
    const campaignId = params.id as string;
    const serviceId = params.serviceId as string;

    const {fetchCampaign} = useCampaign();

    useEffect(() => {
        if (campaignId) {
            fetchCampaign(campaignId);
        }
    }, [campaignId, fetchCampaign]);

    return (
        <div className={'w-full md:max-w-xl'}>
            {
                serviceId && (
                    <ServiceHeader/>
                )
            }
            <div className={serviceId && 'hidden'}>
                <CampaignHeader/>
            </div>
        </div>
    );
};
export default CampaignMainHeader

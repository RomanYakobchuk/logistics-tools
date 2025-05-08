'use client';

import RequireAuth from '@/components/auth/require-auth';
import {CampaignProvider} from "@/lib/campaign/campaign-context";
import {ServiceProvider} from "@/lib/campaign/service-context";
import CampaignMainHeader from "@/components/krews/campaigns/CampaignMainHeader";

export default function KrewsLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {

    return (
        <RequireAuth>
            <CampaignProvider>
                <ServiceProvider>
                    <div className="p-6 max-w-7xl mx-auto">
                       <CampaignMainHeader/>
                        {children}
                    </div>
                </ServiceProvider>
            </CampaignProvider>
        </RequireAuth>
    );
}
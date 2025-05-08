'use client';

import React, {createContext, useContext, useState, useCallback, ReactNode, useRef} from 'react';
import {CompanyBaseInfo} from '@/lib/api/types/auth-types';
import {ICampaign} from '@/interfaces/sms';
import {getCampaigns} from '@/lib/api/sms-service';

interface CampaignContextType {
    company: CompanyBaseInfo | null;
    campaign: ICampaign | null;
    isLoading: boolean;
    error: string | null;
    fetchCampaign: (campaignId: string) => Promise<void>;
    resetCampaignState: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [company, setCompany] = useState<CompanyBaseInfo | null>(null);
    const [campaign, setCampaign] = useState<ICampaign | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Use a ref to track the current campaign ID to avoid dependency issues
    const currentCampaignIdRef = useRef<string | null>(null);

    const fetchCampaign = useCallback(async (campaignId: string) => {
        // If we already have this campaign loaded, don't fetch again
        if (campaign && campaign.id === campaignId && !isLoading) {
            return;
        }

        // To prevent multiple simultaneous requests for the same campaign
        if (isLoading && currentCampaignIdRef.current === campaignId) {
            return;
        }

        currentCampaignIdRef.current = campaignId;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getCampaigns(campaignId);

            if (data?.items.length > 0) {
                const cam = data?.items?.[0]?.campaign;
                const com = data?.items?.[0]?.company;
                setCampaign(cam);
                setCompany(com);

                // Update document title if in browser environment
                if (typeof document !== 'undefined') {
                    document.title = `${cam?.friendlyName} | SMS Campaign | Krews`;
                }
            }

            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error fetching campaign:', err);
            setError(err.message || 'Failed to load campaign details');
            setCampaign(null);
            setCompany(null);
        } finally {
            setIsLoading(false);
        }
    }, []); // Remove campaign and isLoading from dependencies to prevent re-creation of the callback

    const resetCampaignState = useCallback(() => {
        setCampaign(null);
        setCompany(null);
        setError(null);
        currentCampaignIdRef.current = null;
    }, []);

    const value = {
        company,
        campaign,
        isLoading,
        error,
        fetchCampaign,
        resetCampaignState,
    };

    return (
        <CampaignContext.Provider value={value}>
            {children}
        </CampaignContext.Provider>
    );
};

export const useCampaign = (): CampaignContextType => {
    const context = useContext(CampaignContext);

    if (context === undefined) {
        throw new Error('useCampaign must be used within a CampaignProvider');
    }

    return context;
};
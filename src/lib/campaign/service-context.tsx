'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { IService } from '@/interfaces/sms';
import { getCampaignServices } from '@/lib/api/sms-service';
import { useCampaign } from '@/lib/campaign/campaign-context';

interface ServiceContextType {
    service: IService | null;
    isLoading: boolean;
    error: string | null;
    fetchService: (serviceId: string) => Promise<void>;
    resetServiceState: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [service, setService] = useState<IService | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { campaign } = useCampaign();

    const currentServiceIdRef = useRef<string | null>(null);

    const fetchService = useCallback(async (serviceId: string) => {
        if (service && service.sid === serviceId && !isLoading) {
            return;
        }

        if (isLoading && currentServiceIdRef.current === serviceId) {
            return;
        }

        if (!campaign) {
            setError('Campaign data not available');
            return;
        }

        currentServiceIdRef.current = serviceId;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getCampaignServices(campaign.friendlyName, serviceId);

            if (data && data.items && data.items.length > 0) {
                const targetService = data.items.find(s => s.sid === serviceId);

                if (targetService) {
                    setService(targetService);

                    if (typeof document !== 'undefined') {
                        document.title = `${targetService.friendlyName} | ${campaign.friendlyName} | SMS Service | Krews`;
                    }
                } else {
                    throw new Error('Service not found');
                }
            } else {
                throw new Error('Service not found');
            }

            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error fetching service:', err);
            setError(err.message || 'Failed to load service details');
            setService(null);
        } finally {
            setIsLoading(false);
        }
    }, [campaign, service, isLoading]);

    const resetServiceState = useCallback(() => {
        setService(null);
        setError(null);
        currentServiceIdRef.current = null;
    }, []);

    useEffect(() => {
        if (!campaign) {
            resetServiceState();
        }
    }, [campaign, resetServiceState]);

    const value = {
        service,
        isLoading,
        error,
        fetchService,
        resetServiceState,
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = (): ServiceContextType => {
    const context = useContext(ServiceContext);

    if (context === undefined) {
        throw new Error('useService must be used within a ServiceProvider');
    }

    return context;
};
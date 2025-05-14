'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/require-auth';
import { createCampaign } from '@/lib/api/sms-service';
import { ICampaignForm } from '@/interfaces/sms';
import UseCaseSelector from '@/components/krews/services/UseCaseSelector';
import { useCampaign } from "@/lib/campaign/campaign-context";

const useCaseOptions = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'verification', label: 'Verification' },
    { value: 'discussion', label: 'Discussion' },
    { value: 'poll', label: 'Poll' },
    { value: 'undeclared', label: 'Undeclared' }
];

export default function NewServiceForm() {
    const router = useRouter();

    const { campaign, isLoading, error: campaignError } = useCampaign();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<ICampaignForm>({
        companyId: '',
        friendlyName: '',
        useCase: 'marketing',
    });


    useEffect(() => {
        if (campaign) {
            setFormData(prev => ({
                ...prev,
                companyId: campaign.friendlyName
            }));

            document.title = `New Service for ${campaign?.friendlyName} | Krews`;
        }
    }, [campaign]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await createCampaign(formData);
            handleBack();
            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error creating service:', err);
            setError(err.message || 'Failed to create service');
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        router.push(`/krews/campaigns/${campaign?.friendlyName}/services`);
    };

    if (isLoading) {
        return (
            <RequireAuth>
                <div className="w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New SMS Service</h1>
                        <p className="text-gray-600 mt-1">
                            Add a new service to your campaign
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600 font-medium">Loading campaign details...</p>
                    </div>
                </div>
            </RequireAuth>
        );
    }

    if (!campaign) {
        return (
            <RequireAuth>
                <div className="w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New SMS Service</h1>
                        <p className="text-gray-600 mt-1">
                            Add a new service to your campaign
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center w-full mx-auto">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Campaign Not Found</h3>
                        <p className="text-gray-600 mb-6">
                            The campaign you&apos;re trying to add a service to doesn&apos;t exist or has been deleted.
                        </p>

                        {(error || campaignError) && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md text-left">
                                {error || campaignError}
                            </div>
                        )}

                        <button
                            onClick={() => router.push('/krews/campaigns')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Back to Campaigns
                        </button>
                    </div>
                </div>
            </RequireAuth>
        );
    }

    return (
        <RequireAuth>
            <div className="w-full">
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
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New SMS Service</h1>
                    <p className="text-gray-600 mt-1">
                        Add a new service to your campaign
                    </p>
                </div>

                <div className="w-full mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Details</h2>

                    {(error || campaignError) && (
                        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                            {error || campaignError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="friendlyName" className="block text-sm font-medium text-gray-700 mb-1">
                                Service Name
                            </label>
                            <input
                                type="text"
                                id="friendlyName"
                                name="friendlyName"
                                value={formData.friendlyName}
                                onChange={handleInputChange}
                                required
                                placeholder="My SMS Service"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">A friendly name to identify this SMS service</p>
                        </div>

                        {/* Використовуємо оновлені опції useCase */}
                        <UseCaseSelector
                            id="useCase"
                            name="useCase"
                            value={formData.useCase}
                            options={useCaseOptions}
                            onChange={handleInputChange}
                            label="Use Case"
                            description="The primary purpose of this service (as specified by Twilio API)"
                            required
                        />

                        <div className="pt-4 flex justify-between">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.friendlyName}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                    stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </span>
                                ) : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </RequireAuth>
    );
}
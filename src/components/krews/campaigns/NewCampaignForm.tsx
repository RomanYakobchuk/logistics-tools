'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import RequireAuth from '@/components/auth/require-auth';
import CompanySelector from '@/components/auth/company-selector';
import {getCompaniesNonCampaigns, createCampaign} from '@/lib/api/sms-service';
import {CompanyBaseInfo} from '@/lib/api/types/auth-types';
import {ICampaignForm} from "@/interfaces/sms";
import UseCaseSelector from '../services/UseCaseSelector';
import SelectedCompanyInfo from './NewSelectedCompanyInfo';

type Step = 'selectCompany' | 'createCampaign';

const useCaseOptions = [
    {value: 'marketing', label: 'Marketing'},
    {value: 'notifications', label: 'Notifications'},
    {value: 'verification', label: 'Verification'},
    {value: 'alerts', label: 'System Alerts'},
    {value: 'customer_service', label: 'Customer Service'},
    {value: 'other', label: 'Other'},
];

export default function NewCampaignForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>('selectCompany');
    const [companies, setCompanies] = useState<CompanyBaseInfo[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyBaseInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<ICampaignForm>({
        companyId: '',
        friendlyName: '',
        useCase: 'marketing',
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setIsLoading(true);
            const data = await getCompaniesNonCampaigns();
            setCompanies(data.items || []);
            /* eslint-disable */
        } catch (err: any) {
            /* eslint-enable */
            console.error('Error fetching companies:', err);
            setError(err.message || 'Failed to load companies');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompanySelect = (companyId: string) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
            setSelectedCompany(company);
            setFormData(prev => ({...prev, companyId}));
            setCurrentStep('createCampaign');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await createCampaign(formData);

            router.push(`/krews/campaigns/${response.campaign.friendlyName}`);
            /* eslint-disable */
        } catch (err: any) {
            /* eslint-enable */
            console.error('Error creating campaign:', err);
            setError(err.message || 'Failed to create campaign');
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep === 'createCampaign') {
            setCurrentStep('selectCompany');
        } else {
            router.push('/krews/campaigns');
        }
    };

    if (!isLoading && companies.length === 0) {
        return (
            <RequireAuth>
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Create New SMS Campaign</h1>
                        <p className="text-gray-600 mt-1">
                            Set up a new messaging campaign for your business
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-8 text-center w-full mx-auto">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Available Companies</h3>
                        <p className="text-gray-600 mb-6">
                            All companies already have campaigns associated with them, or there are no companies
                            available.
                            You need to create a new company or free up an existing one before creating a new campaign.
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-left">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleBack}
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
            <div className="p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create New SMS Campaign</h1>
                    <p className="text-gray-600 mt-1">
                        Set up a new messaging campaign for your business
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentStep === 'selectCompany' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                        } font-bold`}>
                            1
                        </div>
                        <div className={`h-1 w-12 ${
                            currentStep === 'createCampaign' ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            currentStep === 'createCampaign' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                        } font-bold`}>
                            2
                        </div>
                    </div>
                    <div className="flex mt-2">
                        <div className="w-10 text-center text-sm text-gray-600">Company</div>
                        <div className="w-12"></div>
                        <div className="w-10 text-center text-sm text-gray-600">Details</div>
                    </div>
                </div>

                {currentStep === 'selectCompany' && (
                    <div className="w-full mx-auto">
                        {/* Добавляем кнопку "Назад" */}
                        <div className="mb-4">
                            <button
                                onClick={handleBack}
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

                        <CompanySelector
                            companies={companies}
                            onSelect={handleCompanySelect}
                            isLoading={isLoading}
                            error={error}
                        />
                    </div>
                )}

                {currentStep === 'createCampaign' && (
                    <div className="w-full mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Campaign Details</h2>

                        {/* Показываем информацию о выбранной компании */}
                        <SelectedCompanyInfo company={selectedCompany} />

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
                                {error}
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
                                    placeholder="My Twilio Service"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="mt-1 text-sm text-gray-500">A friendly name to identify this Twilio
                                    service</p>
                            </div>

                            {/* Заменяем стандартный селектор на кастомный */}
                            <UseCaseSelector
                                id="useCase"
                                name="useCase"
                                value={formData.useCase}
                                options={useCaseOptions}
                                onChange={handleInputChange}
                                label="Use Case"
                                description="What will this service be used for?"
                                required
                            />

                            <div className="pt-4 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Back
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
                                    ) : 'Create Campaign'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </RequireAuth>
    );
}
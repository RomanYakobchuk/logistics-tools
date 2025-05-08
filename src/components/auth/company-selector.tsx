'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CompanyBaseInfo } from '@/lib/api/types/auth-types';

interface CompanySelectorProps {
    companies: CompanyBaseInfo[];
    onSelect: (companyId: string) => void;
    isLoading: boolean;
    error: string;
}

export default function CompanySelector({ companies, onSelect, isLoading, error }: CompanySelectorProps) {
    const [selectedCompany, setSelectedCompany] = useState<string>('');

    const handleCompanyClick = (companyId: string) => {
        setSelectedCompany(companyId);
        onSelect(companyId);
    };

    return (
        <div className="w-full max-w-4xl p-6 md:p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Select Company</h1>
                <p className="mt-2 text-gray-600">Choose a company to log in</p>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            onClick={() => handleCompanyClick(company.id)}
                            className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors hover:shadow-md ${
                                selectedCompany === company.id
                                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                                {company.logo ? (
                                    <Image
                                        src={company.logo}
                                        alt={company.name || company.id}
                                        width={48}
                                        height={48}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="ml-4 flex-grow min-w-0">
                                <h3 className="text-lg font-medium text-gray-900 truncate text-wrap text-start">
                                    {company.name || company.id}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}
        </div>
    );
}
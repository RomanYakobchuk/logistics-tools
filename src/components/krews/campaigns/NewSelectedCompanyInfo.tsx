'use client';

import Image from 'next/image';
import { CompanyBaseInfo } from '@/lib/api/types/auth-types';

interface SelectedCompanyInfoProps {
    company: CompanyBaseInfo | null;
}

export default function NewSelectedCompanyInfo({ company }: SelectedCompanyInfoProps) {
    if (!company) {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-md p-4 mb-6 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Selected Company</h3>
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                    {company.logo ? (
                        <Image
                            src={company.logo}
                            alt={company.name || company.id}
                            width={40}
                            height={40}
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
                <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900">
                        {company.name || company.id}
                    </h4>
                    <p className="text-xs text-gray-500">
                        Campaign will be created for this company
                    </p>
                </div>
            </div>
        </div>
    );
}
'use client';

import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {useAuth} from '@/lib/auth/auth-context';
import {getCompanies} from '@/lib/api/auth-service';
import {CompanyBaseInfo} from "@/lib/api/types/auth-types";

export default function CompanySwitcher() {
    const {company: currentCompanyId, accessToken, refreshToken, setSession} = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [companies, setCompanies] = useState<CompanyBaseInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentCompany, setCurrentCompany] = useState<CompanyBaseInfo | null>(null);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setIsLoading(true);
                const response = await getCompanies();
                setCompanies(response.items?.sort((a, b) => a?.name?.localeCompare(b?.name)));

                const current = response.items.find(c => c.id === currentCompanyId);
                if (current) {
                    setCurrentCompany(current);
                }
            } catch (err) {
                setError('Failed to load companies');
                console.error('Error fetching companies:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, [currentCompanyId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCompanySwitch = async (companyId: string) => {
        if (companyId === currentCompanyId) {
            setIsOpen(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/sign-in/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken,
                    refreshToken,
                    company: companyId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to switch company');
            }

            const data = await response.json();
            setSession(data);
            setIsOpen(false);

            const selected = companies.find(c => c.id === companyId);
            if (selected) {
                setCurrentCompany(selected);
            }
        } catch (err) {
            setError('Failed to switch company');
            console.error('Error switching company:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative group" ref={dropdownRef}>
            {error && (
                <div className="absolute top-full right-0 mt-1 p-2 text-sm text-red-600 bg-red-100 rounded-md z-50">
                    {error}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-50 text-blue-700 transition-colors group relative"
                aria-label="Switch company"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                    <>
                        {
                            currentCompany?.logo ? (
                                <div className="w-8 h-8 relative overflow-hidden rounded-md">
                                    <Image
                                        src={currentCompany?.logo}
                                        alt={currentCompany?.name || currentCompany?.id || 'company'}
                                        width={32}
                                        height={32}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                    </svg>
                                </div>
                            )
                        }
                        <span className="text-wrap text-start font-medium">
                            {currentCompany?.name || currentCompanyId || 'Company'}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                        </svg>
                    </>
                )}
                <span
                    className="absolute top-full mt-1 w-32 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity text-center z-50">
                    Switch Company
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-1 w-64 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
                            Select Company
                        </div>
                        {companies?.map((company) => (
                            <button
                                key={company.id}
                                onClick={() => handleCompanySwitch(company.id)}
                                className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                                    company.id === currentCompanyId ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
                                }`}
                            >
                                {company.logo ? (
                                    <div className="w-8 h-8 relative overflow-hidden rounded-md">
                                        <Image
                                            src={company.logo}
                                            alt={company.name || company.id}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                        </svg>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate text-wrap text-start">
                                        {company.name || company.id}
                                    </div>
                                </div>
                                {company.id === currentCompanyId && (
                                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24"
                                         stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
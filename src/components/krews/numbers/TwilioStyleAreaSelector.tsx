'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    usAreaCodesArray,
    canadianAreaCodesArray,
    groupedAreaCodes,
    AreaCodeInfo
} from '@/utils/area-codes';

interface TwilioStyleAreaSelectorProps {
    onSelectionChange: (countryCode: string, areaCode: string) => void;
    initialCountry?: string;
    initialAreaCode?: string;
    label?: string;
    className?: string;
}

export default function TwilioStyleAreaSelector({
                                                    onSelectionChange,
                                                    initialCountry = 'US',
                                                    initialAreaCode,
                                                        className = ''
                                                }: TwilioStyleAreaSelectorProps) {
    // Get the default area code for the selected country
    const getDefaultAreaCode = (country: string): string => {
        if (initialAreaCode) {
            // Check if initialAreaCode exists for the selected country
            const exists = country === 'US'
                ? usAreaCodesArray.some(a => a.code === initialAreaCode)
                : canadianAreaCodesArray.some(a => a.code === initialAreaCode);

            if (exists) return initialAreaCode;
        }

        // Otherwise use defaults
        return country === 'US' ? '205' : '204';
    };

    // States
    const [countryCode, setCountryCode] = useState<string>(initialCountry);
    const [areaCode, setAreaCode] = useState<string>(getDefaultAreaCode(initialCountry));
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedTab, setSelectedTab] = useState<'codes' | 'regions'>('codes');

    // Refs
    const modalRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // When the country changes, reset the area code
    useEffect(() => {
        const newAreaCode = getDefaultAreaCode(countryCode);
        setAreaCode(newAreaCode);
        onSelectionChange(countryCode, newAreaCode);
    }, [countryCode]);

    // Focus the search input when the modal opens
    useEffect(() => {
        if (isModalOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isModalOpen]);

    // Handle click outside to close the modal
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    // Filter area codes based on search term
    const filteredAreaCodes = useMemo(() => {
        if (!searchTerm) {
            return countryCode === 'US' ? usAreaCodesArray : canadianAreaCodesArray;
        }

        const term = searchTerm.toLowerCase();
        const codes = countryCode === 'US' ? usAreaCodesArray : canadianAreaCodesArray;

        return codes.filter(item => {
            // Search by code
            if (item.code.includes(term)) return true;

            // Search by region name
            if (item.region.toLowerCase().includes(term)) return true;

            return false;
        });
    }, [countryCode, searchTerm]);

    // Get the current area code info
    const selectedAreaInfo = useMemo(() => {
        const codes = countryCode === 'US' ? usAreaCodesArray : canadianAreaCodesArray;
        return codes.find(item => item.code === areaCode) || codes[0];
    }, [countryCode, areaCode]);

    // Format the phone representation for display
    const formattedNumber = useMemo(() => {
        return `+1 (${areaCode}) XXX-XXXX`;
    }, [areaCode]);

    // Handle area code selection
    const handleAreaCodeSelect = (code: string) => {
        setAreaCode(code);
        onSelectionChange(countryCode, code);
        setIsModalOpen(false);
        setSearchTerm('');
    };

    // Handle country change
    const handleCountryChange = (country: string) => {
        setCountryCode(country);
        setSelectedTab('codes');
        setSearchTerm('');
    };

    // Group search results by region for better UI
    const groupedSearchResults = useMemo(() => {
        // If search is active, group results by region
        if (searchTerm) {
            return filteredAreaCodes.reduce((acc, item) => {
                if (!acc[item.region]) {
                    acc[item.region] = [];
                }
                acc[item.region].push(item);
                return acc;
            }, {} as Record<string, AreaCodeInfo[]>);
        }

        // If no search, return empty to use the pre-grouped data
        return {};
    }, [filteredAreaCodes, searchTerm]);

    return (
        <div className={`relative ${className}`}>

            {/* Main Button */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
            >
                <div className="flex items-center">
                    <div className="mr-2">
                        <span className="w-6 h-6 flex-shrink-0">
                            {countryCode === 'US' ? (
                                <span className="text-lg">🇺🇸</span>
                            ) : (
                                <span className="text-lg">🇨🇦</span>
                            )}
                        </span>
                    </div>
                    <span className="font-medium">{formattedNumber}</span>
                </div>
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full h-[80dvh] max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Select Area Code</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Country Selector */}
                        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    onClick={() => handleCountryChange('US')}
                                    className={`flex items-center px-3 py-2 rounded-md ${
                                        countryCode === 'US'
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg mr-2">🇺🇸</span>
                                    <span>United States</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleCountryChange('CA')}
                                    className={`flex items-center px-3 py-2 rounded-md ${
                                        countryCode === 'CA'
                                            ? 'bg-blue-100 text-blue-700 font-medium'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <span className="text-lg mr-2">🇨🇦</span>
                                    <span>Canada</span>
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="px-6 py-3 border-b border-gray-200">
                            <div className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search area codes or regions..."
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchTerm('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg className="h-5 w-5 text-gray-400 hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tabs (only show if not searching) */}
                        {!searchTerm && (
                            <div className="px-6 py-2 border-b border-gray-200">
                                <div className="flex">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTab('codes')}
                                        className={`px-4 py-2 font-medium text-sm rounded-md ${
                                            selectedTab === 'codes'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        Area Codes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTab('regions')}
                                        className={`px-4 py-2 font-medium text-sm rounded-md ml-2 ${
                                            selectedTab === 'regions'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        By Region
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="flex-grow overflow-y-auto p-6">
                            {/* Show search results */}
                            {searchTerm && Object.keys(groupedSearchResults).length > 0 && (
                                <div className="space-y-6">
                                    {Object.entries(groupedSearchResults)
                                        .sort(([regionA], [regionB]) => regionA.localeCompare(regionB))
                                        .map(([region, codes]) => (
                                            <div key={region}>
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">{region}</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                    {codes.map((item) => (
                                                        <button
                                                            key={item.code}
                                                            type="button"
                                                            onClick={() => handleAreaCodeSelect(item.code)}
                                                            className={`px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                                                                areaCode === item.code
                                                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                                                    : 'text-gray-700'
                                                            }`}
                                                        >
                                                            <span>{item.code}</span>
                                                            {areaCode === item.code && (
                                                                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* Show "No results" message */}
                            {searchTerm && Object.keys(groupedSearchResults).length === 0 && (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Try different search terms or clear the search.
                                    </p>
                                </div>
                            )}

                            {/* Show "Area Codes" tab content */}
                            {!searchTerm && selectedTab === 'codes' && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {(countryCode === 'US' ? usAreaCodesArray : canadianAreaCodesArray)
                                        .sort((a, b) => parseInt(a.code) - parseInt(b.code))
                                        .map((item) => (
                                            <button
                                                key={item.code}
                                                type="button"
                                                onClick={() => handleAreaCodeSelect(item.code)}
                                                className={`px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                                                    areaCode === item.code
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                <span>{item.code}</span>
                                                <span className="text-xs text-gray-500 truncate ml-1 flex-grow text-right">{item.region}</span>
                                                {areaCode === item.code && (
                                                    <svg className="h-4 w-4 text-blue-600 flex-shrink-0 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                </div>
                            )}

                            {/* Show "By Region" tab content */}
                            {!searchTerm && selectedTab === 'regions' && (
                                <div className="space-y-6">
                                    {groupedAreaCodes[countryCode as keyof typeof groupedAreaCodes].map(([region, codes]) => (
                                        <div key={region}>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">{region}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                                {codes.map((code) => (
                                                    <button
                                                        key={code}
                                                        type="button"
                                                        onClick={() => handleAreaCodeSelect(code)}
                                                        className={`px-3 py-2 text-sm rounded-md hover:bg-gray-100 flex items-center justify-between ${
                                                            areaCode === code
                                                                ? 'bg-blue-100 text-blue-700 font-medium'
                                                                : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <span>{code}</span>
                                                        {areaCode === code && (
                                                            <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                            <div className="flex items-center">
                                {selectedAreaInfo && (
                                    <div className="text-sm text-gray-600">
                                        Selected: <span className="font-medium text-gray-900">{selectedAreaInfo.code}</span> - {selectedAreaInfo.region}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
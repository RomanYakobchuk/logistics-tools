'use client';

import React, { useState, useEffect, useRef } from 'react';
import PhoneNumbersResults from './PhoneNumbersResults';
import { IAvailableNumbersResponse } from "@/interfaces/sms";
import CountryAreaSelector from "@/components/krews/numbers/CountryAreaSelector";
import { getAvailableNumbers } from "@/lib/api/sms-service";

interface PhoneNumberSearchProps {
    mode?: 'view' | 'select';
    onSelectNumbers?: (selectedNumbers: string[]) => void;
    initialSelectedNumbers?: string[];
}

const PhoneNumberSearch: React.FC<PhoneNumberSearchProps> = ({
                                                                 mode = 'view',
                                                                 onSelectNumbers,
                                                                 initialSelectedNumbers = []
                                                             }) => {
    const defaultAreaCode = '205';
    const defaultCountryCode = 'US';

    const [countryCode, setCountryCode] = useState<string>(defaultCountryCode);
    const [areaCode, setAreaCode] = useState<string>(defaultAreaCode);
    const [results, setResults] = useState<IAvailableNumbersResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [selectedNumbers, setSelectedNumbers] = useState<string[]>(initialSelectedNumbers);
    const initialSearchCompleted = useRef<boolean>(false);
    const pageSize = 20;

    const handleSelectionChange = (country: string, area: string) => {
        setCountryCode(country);
        setAreaCode(area);
        setError(null);
    };

    // Pass selected numbers to parent component when they change
    useEffect(() => {
        if (mode === 'select' && onSelectNumbers) {
            onSelectNumbers(selectedNumbers);
        }
    }, [selectedNumbers, mode, onSelectNumbers]);

    // Perform initial search with default values
    useEffect(() => {
        if (!initialSearchCompleted.current && areaCode) {
            searchNumbers(1);
            initialSearchCompleted.current = true;
        }
    }, [areaCode]);

    const searchNumbers = async (page: number = 1) => {
        // Check if we already have these results to avoid redundant searches
        if (results?.areaCode === areaCode &&
            results?.countryCode === countryCode &&
            results?.page === page &&
            results?.pageSize === pageSize) return;

        if (!areaCode) return;

        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        setError(null);

        try {
            const data = await getAvailableNumbers(areaCode, countryCode, page, pageSize);

            if (page === 1) {
                setResults(data);
            } else {
                setResults(prev => {
                    if (!prev) return data;

                    return {
                        ...data,
                        items: [...prev.items, ...data.items],
                    };
                });
            }

            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching available numbers:', error);
            setError(error instanceof Error ? error.message : 'Failed to load phone numbers');
            if (page === 1) {
                setResults(null);
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (results && results.hasMore && !isLoadingMore) {
            searchNumbers(currentPage + 1);
        }
    };

    const handleNumberSelect = (phoneNumber: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedNumbers(prev => [...prev, phoneNumber]);
        } else {
            setSelectedNumbers(prev => prev.filter(num => num !== phoneNumber));
        }
    };

    const disabled = isLoading || !areaCode || (results?.areaCode === areaCode && results?.countryCode === countryCode);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Search Available Phone Numbers
                </h2>

                <CountryAreaSelector
                    onSelectionChange={handleSelectionChange}
                    initialCountry={defaultCountryCode}
                />

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => searchNumbers(1)}
                        disabled={disabled}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching...
                            </span>
                        ) : 'Search Numbers'}
                    </button>
                </div>
            </div>

            <PhoneNumbersResults
                results={results}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                mode={mode}
                selectedNumbers={selectedNumbers}
                onNumberSelect={handleNumberSelect}
            />

            {mode === 'select' && selectedNumbers.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">
                            Selected Numbers: {selectedNumbers.length}
                        </h3>
                        <button
                            onClick={() => setSelectedNumbers([])}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhoneNumberSearch;
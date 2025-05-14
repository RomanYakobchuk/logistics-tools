'use client';

import React, {useState, useEffect, useRef} from 'react';
import PhoneNumbersResults from './PhoneNumbersResults';
import {IAvailableNumber, IAvailableNumbersResponse} from "@/interfaces/sms";
import {getAvailableNumbers} from "@/lib/api/sms-service";
import TwilioStyleAreaSelector from "@/components/krews/numbers/TwilioStyleAreaSelector";

interface PhoneNumberSearchProps {
    mode?: 'view' | 'select';
    onSelectNumbers?: (selectedNumbers: IAvailableNumbersResponse['items']) => void;
    initialSelectedNumbers?: IAvailableNumbersResponse['items'];
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
    const [selectedNumbers, setSelectedNumbers] = useState<IAvailableNumbersResponse['items']>(initialSelectedNumbers);
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

    const handleNumberSelect = (phoneNumber: IAvailableNumber, isSelected: boolean) => {
        if (isSelected) {
            setSelectedNumbers(prev => [...prev, phoneNumber]);
        } else {
            setSelectedNumbers(prev => prev.filter(num => num !== phoneNumber));
        }
    };
    //
    // const handleRemoveNumber = (phoneNumber: IAvailableNumber) => {
    //     setSelectedNumbers(prev => prev.filter(num => num !== phoneNumber));
    // };
    //
    // const clearAllSelectedNumbers = () => {
    //     setSelectedNumbers([]);
    // };

    const disabled = isLoading || !areaCode || (results?.areaCode === areaCode && results?.countryCode === countryCode);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <div className={'flex flex-col items-start md:items-center md:flex-row gap-4'}>
                    <div className={'w-full'}>
                        <TwilioStyleAreaSelector
                            onSelectionChange={handleSelectionChange}
                            initialCountry={defaultCountryCode}
                        />
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex justify-end md:w-fit">
                        <button
                            onClick={() => searchNumbers(1)}
                            disabled={disabled}
                            className="px-6 text-nowrap py-2.5 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching...
                            </span>
                            ) : 'Search Numbers'}
                        </button>
                    </div>
                </div>
            </div>

            {/*{mode === 'select' && selectedNumbers.length > 0 && (*/}
            {/*    <SelectedNumbersList*/}
            {/*        selectedNumbers={selectedNumbers}*/}
            {/*        onRemoveNumber={handleRemoveNumber}*/}
            {/*        onClearAll={clearAllSelectedNumbers}*/}
            {/*    />*/}
            {/*)}*/}

            <PhoneNumbersResults
                results={results}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                mode={mode}
                selectedNumbers={selectedNumbers}
                onNumberSelect={handleNumberSelect}
            />
        </div>
    );
};

export default PhoneNumberSearch;
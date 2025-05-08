'use client';

import CountryAreaSelector from "@/components/krews/numbers/CountryAreaSelector";
import PhoneNumbersResults from "@/components/krews/numbers/PhoneNumbersResults";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getAvailableNumbers} from "@/lib/api/sms-service";
import {IAvailableNumber, IAvailableNumbersResponse} from "@/interfaces/sms";
import {useCampaign} from "@/lib/campaign/campaign-context";

type Props = {
    selectedNumbers: string[];
    setSelectedNumbers: Dispatch<SetStateAction<string[]>>;
}

const SelectNumbers = ({selectedNumbers, setSelectedNumbers}: Props) => {

    const {campaign} = useCampaign();


    const [countryCode, setCountryCode] = useState<string>('US');
    const [areaCode, setAreaCode] = useState<string>('205');
    const [results, setResults] = useState<IAvailableNumbersResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedNumberDetails, setSelectedNumberDetails] = useState<IAvailableNumber[]>([]);


    const handleSelectionChange = (country: string, area: string) => {
        setCountryCode(country);
        setAreaCode(area);
        setCurrentPage(1);
        setSelectedNumbers([]);
        setError(null);
    };

    const searchNumbers = async (page: number = 1) => {
        if (!areaCode) return;

        if (page === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        setError(null);

        try {
            const data = await getAvailableNumbers(areaCode, countryCode, page, 20);

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
            console.error('Error fetching numbers:', error);
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

            const numberDetail = results?.items.find(item => item.phoneNumber === phoneNumber);
            if (numberDetail) {
                setSelectedNumberDetails(prev => [...prev, numberDetail]);
            }
        } else {
            setSelectedNumbers(prev => prev.filter(num => num !== phoneNumber));
            setSelectedNumberDetails(prev => prev.filter(item => item.phoneNumber !== phoneNumber));
        }
    };

    useEffect(() => {
        searchNumbers(1);
    }, []);

    const disabledSearchButton = isLoading || !areaCode || results?.areaCode === areaCode && results?.countryCode === countryCode;

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Parameters</h2>

                    <CountryAreaSelector
                        onSelectionChange={handleSelectionChange}
                        initialCountry={countryCode}
                    />

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={() => {
                                setSelectedNumbers([]);
                                setSelectedNumberDetails([]);
                                setAreaCode('205');
                                setCountryCode('US');
                            }}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Reset All
                        </button>

                        <button
                            onClick={() => searchNumbers(1)}
                            disabled={disabledSearchButton}
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
            </div>

            <PhoneNumbersResults
                results={results}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                onLoadMore={handleLoadMore}
                mode="select"
                selectedNumbers={selectedNumbers}
                onNumberSelect={handleNumberSelect}
            />

            {/*{selectedNumbers.length > 0 && (*/}
            {/*    <div className="mt-6 bg-white rounded-lg shadow-md p-6">*/}
            {/*        <h2 className="text-lg font-semibold text-gray-800 mb-4">Selected Numbers ({selectedNumbers.length})</h2>*/}

            {/*        <div className="overflow-auto max-h-64">*/}
            {/*            <table className="min-w-full divide-y divide-gray-200">*/}
            {/*                <thead className="bg-gray-50">*/}
            {/*                <tr>*/}
            {/*                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
            {/*                        Phone Number*/}
            {/*                    </th>*/}
            {/*                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
            {/*                        Location*/}
            {/*                    </th>*/}
            {/*                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
            {/*                        Monthly Cost*/}
            {/*                    </th>*/}
            {/*                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">*/}
            {/*                        Actions*/}
            {/*                    </th>*/}
            {/*                </tr>*/}
            {/*                </thead>*/}
            {/*                <tbody className="bg-white divide-y divide-gray-200">*/}
            {/*                {selectedNumberDetails.map((number) => (*/}
            {/*                    <tr key={number.phoneNumber}>*/}
            {/*                        <td className="px-6 py-4 whitespace-nowrap">*/}
            {/*                            <div className="text-sm font-medium text-gray-900">{number.friendlyName}</div>*/}
            {/*                            <div className="text-sm text-gray-500">{number.phoneNumber}</div>*/}
            {/*                        </td>*/}
            {/*                        <td className="px-6 py-4 whitespace-nowrap">*/}
            {/*                            <div className="text-sm text-gray-900">*/}
            {/*                                {number.locality ? `${number.locality}, ` : ''}{number.region}*/}
            {/*                            </div>*/}
            {/*                        </td>*/}
            {/*                        <td className="px-6 py-4 whitespace-nowrap">*/}
            {/*                            <div className="text-sm text-gray-900">*/}
            {/*                                {number.pricing.currentPrice || number.pricing.basePrice}*/}
            {/*                            </div>*/}
            {/*                        </td>*/}
            {/*                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">*/}
            {/*                            <button*/}
            {/*                                onClick={() => handleNumberSelect(number.phoneNumber, false)}*/}
            {/*                                className="text-red-600 hover:text-red-900"*/}
            {/*                            >*/}
            {/*                                Remove*/}
            {/*                            </button>*/}
            {/*                        </td>*/}
            {/*                    </tr>*/}
            {/*                ))}*/}
            {/*                </tbody>*/}
            {/*            </table>*/}
            {/*        </div>*/}

            {/*        <div className="mt-6 flex justify-end">*/}
            {/*            <button*/}
            {/*                onClick={() => {*/}
            {/*                    setSelectedNumbers([]);*/}
            {/*                    setSelectedNumberDetails([]);*/}
            {/*                }}*/}
            {/*                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
            {/*            >*/}
            {/*                Clear Selection*/}
            {/*            </button>*/}

            {/*            <button*/}
            {/*                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"*/}
            {/*            >*/}
            {/*                Process Selected Numbers*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};
export default SelectNumbers

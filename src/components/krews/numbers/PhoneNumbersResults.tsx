import React from 'react';
import { IAvailableNumber, IAvailableNumbersResponse } from "@/interfaces/sms";

interface PhoneNumbersResultsProps {
    results: IAvailableNumbersResponse | null;
    isLoading: boolean;
    isLoadingMore?: boolean;
    onLoadMore: () => void;
    mode?: 'view' | 'select';
    selectedNumbers?: IAvailableNumber[];
    onNumberSelect?: (phoneNumber: IAvailableNumber, isSelected: boolean) => void;
}

const PhoneNumbersResults: React.FC<PhoneNumbersResultsProps> = ({
                                                                     results,
                                                                     isLoading,
                                                                     isLoadingMore = false,
                                                                     onLoadMore,
                                                                     mode = 'view',
                                                                     selectedNumbers = [],
                                                                     onNumberSelect
                                                                 }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Searching for numbers...</p>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Search</h3>
                <p className="text-gray-600">Select a country and area code, then click search to find available phone numbers</p>
            </div>
        );
    }

    if (results.count === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Numbers Found</h3>
                <p className="text-gray-600 mb-2">We couldn&apos;t find any available numbers for the selected criteria</p>
                <p className="text-gray-500 text-sm">
                    Try searching for a different area code or country
                </p>
            </div>
        );
    }

    const items = results?.items?.reduce((acc: IAvailableNumber[], current) => {
        if (!current?.phoneNumber || acc.some(item => item.phoneNumber === current.phoneNumber)) {
            return acc;
        }
        acc.push(current);
        return acc;
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex flex-col flex-wrap sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Available Numbers</h2>
                    <p className="text-sm text-gray-500">Area code: {results.areaCode}, {results.countryCode === 'US' ? 'United States' : 'Canada'}</p>
                </div>
                <div className="flex items-center gap-2">
                    {mode === 'select' && (
                        <div className="px-3 py-1.5 bg-green-50 rounded-full text-sm font-medium text-green-700">
                            Selected: {selectedNumbers.length}
                        </div>
                    )}
                    <div className="px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                        Showing {items?.length} numbers
                    </div>
                </div>
            </div>

            <div className="overflow-auto lg:max-h-[calc(100dvh-636px)]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {mode === 'select' && (
                            <th scope="col" className="pl-6 pr-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Select
                            </th>
                        )}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capabilities
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {items?.map((number, index) => {
                        const isSelected = selectedNumbers.includes(number);

                        return (
                            <tr
                                key={number?.phoneNumber}
                                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isSelected ? '!bg-blue-50' : ''} ${mode === 'select' ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
                                onClick={mode === 'select' && onNumberSelect ? () => onNumberSelect(number, !isSelected) : undefined}
                            >
                                {mode === 'select' && (
                                    <td className="pl-6 pr-3 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    if (onNumberSelect) {
                                                        onNumberSelect(number, e.target.checked);
                                                    }
                                                }}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </td>
                                )}
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{number?.friendlyName}</div>
                                            <div className="text-sm text-gray-500">{number?.phoneNumber}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-2 text-sm text-gray-900">
                                            {number?.locality ? (
                                                <>
                                                    <span>{number.locality}</span>
                                                    <span className="text-gray-500">, </span>
                                                </>
                                            ) : null}
                                            <span>{number?.region}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        {number.capabilities?.voice && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Voice
                                            </span>
                                        )}
                                        {number.capabilities?.SMS && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                SMS
                                            </span>
                                        )}
                                        {number.capabilities?.MMS && (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                MMS
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-5 w-5 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-2">
                                            <div className="text-sm font-medium text-gray-900">
                                                {number?.pricing?.currentPrice || number?.pricing?.basePrice} <span className="text-xs text-gray-600">/ month</span>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {number?.pricing?.priceUnit}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {results?.hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center disabled:opacity-70"
                    >
                        {isLoadingMore ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading More...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Load More Numbers
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhoneNumbersResults;
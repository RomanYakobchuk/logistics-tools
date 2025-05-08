'use client';

import React from 'react';
import {IAvailableNumbersResponse} from "@/interfaces/sms";

interface NumbersResultsTableProps {
    results: IAvailableNumbersResponse | null;
    isLoading: boolean;
    onLoadMore: () => void;
}

export default function NumbersResultsTable({
                                                results,
                                                isLoading,
                                                onLoadMore
                                            }: NumbersResultsTableProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!results) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Please search for available numbers</p>
            </div>
        );
    }

    if (results.count === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">No numbers found for the selected criteria</p>
                <p className="text-gray-500 text-sm mt-2">
                    Try searching for a different area code or country
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                    Available Numbers
                </h2>
                <div className="text-sm text-gray-500">
                    Showing {results.items.length} of {results.count} results
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capabilities
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {results.items.map((number, index) => (
                        <tr key={number.phoneNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{number.friendlyName}</div>
                                <div className="text-sm text-gray-500">{number.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                    {number.locality ? `${number.locality}, ` : ''}{number.region}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    {number.capabilities.voice && (
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Voice
                      </span>
                                    )}
                                    {number.capabilities.SMS && (
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        SMS
                      </span>
                                    )}
                                    {number.capabilities.MMS && (
                                        <span
                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        MMS
                      </span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {number.pricing.currentPrice || number.pricing.basePrice} {number.pricing.priceUnit}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {results.hasMore && (
                <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <button
                        onClick={onLoadMore}
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Load More Numbers
                    </button>
                </div>
            )}
        </div>
    );
}
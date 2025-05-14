'use client';

import React, { useState } from 'react';
import { IAvailableNumber } from "@/interfaces/sms";

interface SelectedNumbersListProps {
    selectedNumbers: IAvailableNumber[];
    onRemoveNumber: (phoneNumber: IAvailableNumber) => void;
    onClearAll: () => void;
}

const SelectedNumbersList: React.FC<SelectedNumbersListProps> = ({
                                                                     selectedNumbers,
                                                                     onRemoveNumber,
                                                                     onClearAll
                                                                 }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-300 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                        Selected Numbers: {selectedNumbers.length}
                    </h3>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-2 p-1 rounded-md hover:bg-gray-100"
                        aria-label={isExpanded ? "Collapse selected numbers" : "Expand selected numbers"}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
                <button
                    onClick={onClearAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    Clear All
                </button>
            </div>

            {isExpanded && selectedNumbers.length > 0 && (
                <div className="mt-4 border rounded-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone Number
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capabilities
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedNumbers.map((number, index) => (
                            <tr key={number.phoneNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">{number.friendlyName}</div>
                                            <div className="text-sm text-gray-500">{number.phoneNumber}</div>
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
                                            {number.locality ? (
                                                <>
                                                    <span>{number.locality}</span>
                                                    <span className="text-gray-500">, </span>
                                                </>
                                            ) : null}
                                            <span>{number.region}</span>
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
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onRemoveNumber(number)}
                                        className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center justify-end"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SelectedNumbersList;
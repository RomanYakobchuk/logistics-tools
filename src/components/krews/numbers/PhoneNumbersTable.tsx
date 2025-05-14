'use client';

import {IPhoneNumber, PhoneNumberCapabilities} from '@/interfaces/sms';
import Link from 'next/link';

interface PhoneNumbersTableProps {
    numbers: IPhoneNumber[];
    campaignName: string;
    serviceId?: string;
}

export default function PhoneNumbersTable({ numbers, campaignName, serviceId }: PhoneNumbersTableProps) {
    if (numbers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Phone Numbers</h3>
                <p className="text-gray-600 mb-4">No phone numbers are available for this {serviceId ? 'service' : 'campaign'}.</p>
                <Link
                    href={serviceId
                        ? `/krews/campaigns/${campaignName}/services/${serviceId}/numbers/add`
                        : `/krews/campaigns/${campaignName}/numbers/add`
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Phone Number
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{serviceId ? 'Service' : 'Campaign'} Phone Numbers</h2>
            </div>

            <div className="overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {serviceId ? 'Location' : 'Capabilities'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {serviceId ? 'Capabilities' : 'Service'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {serviceId ? 'Added' : 'Status'}
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {numbers.map((number) => (
                        <tr key={number.sid}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{number.friendlyName}</div>
                                        <div className="text-sm text-gray-500">{number.phoneNumber}</div>
                                    </div>
                                </div>
                            </td>

                            {serviceId ? (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {number.locality ? `${number.locality}, ` : ''}{number.region || 'Unknown'}
                                    </div>
                                    <div className="text-sm text-gray-500">{number.countryCode || 'Unknown'}</div>
                                </td>
                            ) : (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {renderCapabilities(number.capabilities)}
                                    </div>
                                </td>
                            )}

                            {serviceId ? (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        {renderCapabilities(number.capabilities)}
                                    </div>
                                </td>
                            ) : (
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {number.service ? (
                                        <Link
                                            href={`/krews/campaigns/${campaignName}/services/${number.service.sid || number.service.serviceSid}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            {number.service.friendlyName || number.service.serviceName}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-gray-500">Unattached</span>
                                    )}
                                </td>
                            )}

                            {serviceId ? (
                                // Показуємо дату додавання для сервісу
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(number.dateCreated).toLocaleDateString()}
                                </td>
                            ) : (
                                // Показуємо статус для кампанії
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        number.attached
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {number.attached ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                            )}

                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                    aria-disabled={'true'}
                                    href={serviceId
                                        ? `/krews/campaigns/${campaignName}/services/${serviceId}/numbers/${number.sid}`
                                        : `/krews/campaigns/${campaignName}/numbers/${number.sid}`
                                    }
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Manage
                                </Link>
                                <Link
                                    href={serviceId
                                        ? `/krews/campaigns/${campaignName}/services/${serviceId}/numbers/${number.sid}`
                                        : `/krews/campaigns/${campaignName}/numbers/${number.sid}`
                                    }
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Send
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function renderCapabilities(capabilities: PhoneNumberCapabilities) {
    return (
        <>
            {capabilities.sms && (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          SMS
        </span>
            )}
            {capabilities.mms && (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
          MMS
        </span>
            )}
            {capabilities.voice && (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Voice
        </span>
            )}
        </>
    );
}
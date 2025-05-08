'use client';

import { useRouter } from 'next/navigation';
import { IService, ISender } from '@/interfaces/sms';

interface ServicesTableProps {
    services: IService[];
    campaignId: string;
}

export default function ServicesTable({ services, campaignId }: ServicesTableProps) {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleEditService = (serviceId: string) => {
        router.push(`/krews/campaigns/${campaignId}/services/${serviceId}`);
    };

    const handleViewService = (serviceId: string) => {
        router.push(`/krews/campaigns/${campaignId}/services/${serviceId}/numbers`);
    };

    const handleAddSender = (serviceId: string) => {
        router.push(`/krews/campaigns/${campaignId}/services/${serviceId}/senders/new`);
    };

    const servicesWithoutSenders = services.some(service => !service.senders || service.senders.length === 0);

    const renderSenders = (senders: ISender[]) => {
        if (!senders || senders.length === 0) {
            return (
                <div className="flex flex-col">
                    <span className="text-amber-500 italic flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        No senders
                    </span>
                    <span className="text-xs text-gray-500 mt-1">You need to add a sender to send messages</span>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1">
                {senders.map((sender, index) => (
                    <div key={sender.sid || index} className="flex items-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {sender.type === 'phone' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            )}
                            {sender.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {servicesWithoutSenders && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700">
                                <strong>Action required:</strong> Some of your services don&apos;t have senders.
                                To send SMS messages, you need to add a phone number as a sender to each service.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">SMS Services</h2>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-full text-sm font-medium text-blue-700">
                        {services.length} {services.length === 1 ? 'service' : 'services'}
                    </div>
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service Name
                            </th>
                            <th scope="col" className="px-6 min-w-56 w-56 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Senders
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Updated
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {services?.map((service, index) => (
                            <tr key={service.sid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm text-wrap max-w-64 lg:max-w-80 font-medium text-gray-900">{service.friendlyName}</div>
                                            <div className="text-sm text-gray-500">ID: {service.sid}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 min-w-56 w-56 py-4">
                                    <div className="flex flex-col">
                                        {renderSenders(service.senders)}
                                        <button
                                            onClick={() => handleAddSender(service.sid)}
                                            className="mt-2 inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 hover:text-blue-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add Sender
                                        </button>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(service.dateCreated)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(service.dateUpdated)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleViewService(service.sid)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        View
                                    </button>
                                    <button
                                        disabled
                                        onClick={() => handleEditService(service.sid)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
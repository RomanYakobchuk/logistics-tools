'use client';

import React from 'react';
import {SmsMessage} from '@/interfaces/messages';
import Link from "next/link";
import {useCampaign} from "@/lib/campaign/campaign-context";

interface SmsMessagesListProps {
    messages: SmsMessage[];
    onMessageSelect: (message: SmsMessage) => void;
}

const SmsMessagesList: React.FC<SmsMessagesListProps> = ({
                                                             messages,
                                                             onMessageSelect
                                                         }) => {

    const {campaign} = useCampaign();

    if (messages.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Messages Found</h3>
                <p className="text-gray-600">There are no messages to display.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        {
                            campaign && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            )
                        }
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((message) => (
                        <tr key={message.sid} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                    {message.body}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{message.from}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{message.to}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-700 capitalize">
                                        {message.direction.replace('-', ' ')}
                                    </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                        ${message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        message.status === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                        {message.status}
                                    </span>
                            </td>
                            {
                                campaign && (
                                    <td className="px-6 py-4 text-nowrap">
                                        <Link
                                            href={`/krews/campaigns/${campaign.friendlyName}/services/${message?.service?.sid}`}
                                            className={'text-blue-600 hover:text-blue-900'}
                                        >
                                            {message.service?.friendlyName}
                                        </Link>
                                    </td>
                                )
                            }
                            <td className="px-6 py-4 whitespace-nowrap">
                                {message.price ? (
                                    <span className="text-sm text-gray-900">
                                            {message.price} {message.priceUnit}
                                        </span>
                                ) : (
                                    <span className="text-sm text-gray-500">N/A</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {message.dateSent ? new Date(message.dateSent).toLocaleString() : 'Pending'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => onMessageSelect(message)}
                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                >
                                    View Details
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 5l7 7-7 7"/>
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SmsMessagesList;
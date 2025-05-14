'use client';

import React from 'react';
import { SmsMessage } from '@/interfaces/messages';
import Image from "next/image";

interface SmsMessageDetailModalProps {
    message: SmsMessage | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

const SmsMessageDetailModal: React.FC<SmsMessageDetailModalProps> = ({
                                                                         message,
                                                                         isLoading,
                                                                         error,
                                                                         onClose
                                                                     }) => {
    if (!message && !isLoading && !error) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 relative animate-fadeIn overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                        <p className="mt-4 text-gray-600">Loading message details...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 p-4 m-4 rounded-md">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-red-800 font-medium">Error</span>
                        </div>
                        <p className="text-red-700 mt-2">{error}</p>
                    </div>
                )}

                {message && !isLoading && !error && (
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Message Details Column */}
                            <div className="md:col-span-2 space-y-6">
                                <div>
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Message SID</span>
                                    <span className="block text-gray-900 font-semibold bg-gray-100 p-2 rounded-md">{message.sid}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">From</span>
                                        <span className="block text-gray-900 bg-gray-50 p-2 rounded-md">{message.from}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">To</span>
                                        <span className="block text-gray-900 bg-gray-50 p-2 rounded-md">{message.to}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Status</span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                            ${message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            message.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                            {message.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Direction</span>
                                        <span className="block text-gray-700 bg-gray-50 p-2 rounded-md capitalize">
                                            {message.direction.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Column */}
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Created</span>
                                    <span className="block text-gray-900">
                                        {new Date(message.dateCreated).toLocaleString()}
                                    </span>
                                </div>
                                {message.dateSent && (
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Sent</span>
                                        <span className="block text-gray-900">
                                            {new Date(message.dateSent).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <span className="block text-sm font-medium text-gray-500 mb-1">Segments</span>
                                    <span className="block text-gray-900">{message.numSegments}</span>
                                </div>
                                {message.price && (
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Price</span>
                                        <span className="block text-gray-900">
                                            {message.price} {message.priceUnit}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Service Information */}
                        {message.service && (
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-blue-800 mb-3">Messaging Service</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Service Name</span>
                                        <span className="block text-gray-900">{message.service.friendlyName}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Service SID</span>
                                        <span className="block text-gray-900">{message.service.sid}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Use Case</span>
                                        <span className="block text-gray-900">
                                            {message.service.useCase || 'Not specified'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-sm font-medium text-gray-500 mb-1">Has Senders</span>
                                        <span className="block text-gray-900">
                                            {message.service.hasSenders ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Message Body */}
                        <div>
                            <span className="block text-sm font-medium text-gray-500 mb-2">Message Body</span>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <p className="text-gray-900 whitespace-pre-wrap">{message.body}</p>
                            </div>
                        </div>

                        {/* Error Details */}
                        {message.errorCode && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    <span className="text-red-800 font-medium">Error Details</span>
                                </div>
                                <div className="text-sm text-red-700">
                                    <div>Error Code: {message.errorCode}</div>
                                    <div>Error Message: {message.errorMessage || 'No additional error information'}</div>
                                </div>
                            </div>
                        )}

                        {/* Media */}
                        {message.media && message.media.length > 0 && (
                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-2">Attached Media</span>
                                <div className="grid grid-cols-3 gap-4">
                                    {message.media.map((media) => (
                                        <div key={media.sid} className="border rounded-md overflow-hidden">
                                            <Image
                                                src={media.url}
                                                alt={`Media ${media.sid}`}
                                                className="w-full h-32 object-cover"
                                                width={128}
                                                height={128}
                                            />
                                            <div className="p-2 text-xs text-gray-600 truncate">
                                                {media.contentType}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmsMessageDetailModal;
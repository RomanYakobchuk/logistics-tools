'use client';

import Link from 'next/link';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceSid: string,
    campaignName: string,
    messageDetails: {
        twilioMessageSid: string;
        status: string;
        to: string;
        from: string | null;
        messagingServiceSid: string | null;
        dateCreated: string;
    } | null;
}

export default function SuccessModal({
                                         isOpen,
                                         onClose,
                                         messageDetails,
                                         campaignName,
                                         serviceSid
                                     }: SuccessModalProps) {
    if (!isOpen || !messageDetails) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col items-center mb-4">
                    <div className="bg-green-100 rounded-full p-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-center text-lg font-semibold text-gray-900">Message Sent Successfully</h3>
                </div>

                <div className="bg-gray-50 rounded-md p-4 mb-4 border border-gray-100">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div>
                            <span className="font-medium text-gray-500">Message SID:</span>
                            <span className="block text-gray-900 truncate">{messageDetails.twilioMessageSid}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Status:</span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {messageDetails.status}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">From:</span>
                            <span className="block text-gray-900">{messageDetails.from || messageDetails.messagingServiceSid}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">To:</span>
                            <span className="block text-gray-900">{messageDetails.to}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Sent at:</span>
                            <span className="block text-gray-900">
                                {new Date(messageDetails.dateCreated).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between space-x-4">
                    <Link
                        href={`/krews/campaigns/${campaignName}/services/${serviceSid}/messages?message=${messageDetails.twilioMessageSid}`}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center flex items-center justify-center"
                    >
                        View Message Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Link>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
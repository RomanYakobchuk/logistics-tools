'use client';

import RequireAuth from '@/components/auth/require-auth';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <RequireAuth>
            <div className="container p-8 mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Welcome to the management system</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Phone Numbers Card */}
                    <Link
                        href="/krews/available-numbers"
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold text-gray-800">Phone Numbers</h2>
                                <p className="text-gray-600">Search and manage available phone numbers</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <span className="text-blue-600 text-sm font-semibold flex items-center">
                                View Available Numbers
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* SMS Campaigns Card */}
                    <Link
                        href="/krews/campaigns"
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold text-gray-800">SMS Campaigns</h2>
                                <p className="text-gray-600">Manage and monitor your messaging campaigns</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <span className="text-blue-600 text-sm font-semibold flex items-center">
                                View Campaigns
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* Send SMS Card */}
                    <Link
                        href="/krews/send"
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h2 className="text-lg font-semibold text-gray-800">Send SMS</h2>
                                <p className="text-gray-600">Send a new SMS message</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <span className="text-blue-600 text-sm font-semibold flex items-center">
                                Send Message
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </RequireAuth>
    );
}
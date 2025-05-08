'use client';

import Image from 'next/image';
import {useAuth} from '@/lib/auth/auth-context';
import {useEffect, useState} from 'react';
import CompanySwitcher from '@/components/krews/CompanySwitcher';

export default function ProfilePage() {
    const {user, company, branch, loginTime, getSessionTimeRemaining, expiresAt} = useAuth();

    const [formattedLoginTime, setFormattedLoginTime] = useState<string>('');
    const [expiryTime, setExpiryTime] = useState<string>('');
    const [remainingTime, setRemainingTime] = useState<{ minutes: number; seconds: number }>({minutes: 0, seconds: 0});

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
    };

    useEffect(() => {
        if (loginTime) {
            setFormattedLoginTime(formatDate(loginTime));
        }

        if (expiresAt) {
            setExpiryTime(formatDate(expiresAt));
        }

        const updateRemainingTime = () => {
            setRemainingTime(getSessionTimeRemaining());
        };

        updateRemainingTime();

        const interval = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(interval);
    }, [loginTime, expiresAt, getSessionTimeRemaining]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex items-center justify-between sm:justify-start gap-4 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        User Profile
                    </h2>
                    <div className={'w-fit bg-white rounded-md shadow'}>
                        <CompanySwitcher/>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                            {user?.logo ? (
                                <Image
                                    src={user.logo}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-400 text-3xl">
                                    {user?.firstName?.charAt(0)}
                                    {user?.lastName?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="ml-0 sm:ml-6 mt-4 sm:mt-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                {user?.firstName} {user?.lastName}
                            </h3>

                            {/* Session timer */}
                            <div
                                className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                Session expires in: {remainingTime.minutes}m {remainingTime.seconds}s
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-5">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user?.firstName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{user?.lastName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Company</dt>
                                <dd className="mt-1 text-sm text-gray-900">{company}</dd>
                            </div>
                            {branch && (
                                <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Branch</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{branch}</dd>
                                </div>
                            )}
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Login Time</dt>
                                <dd className="mt-1 text-sm text-gray-900">{formattedLoginTime || 'Not available'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Token Expiry Time</dt>
                                <dd className="mt-1 text-sm text-gray-900">{expiryTime || 'Not available'}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Session Status</dt>
                                <dd className="mt-1 text-sm flex items-center">
                                    <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                                        remainingTime.minutes > 5 ? 'bg-green-500' :
                                            remainingTime.minutes > 2 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                                    {remainingTime.minutes > 5 ? 'Active' :
                                        remainingTime.minutes > 2 ? 'Expiring soon' : 'Almost expired'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">About Token Expiration</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>
                            Your session will automatically expire when your authentication token expires.
                            Active usage of the system does not extend the token&apos;s lifetime.
                            If your session expires, you&apos;ll need to log in again to continue.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
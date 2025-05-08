'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/auth-context';
import { getBranches } from '@/lib/api/auth-service';
import { BranchInfo } from '@/lib/api/types/auth-types';

export default function BranchSwitcher() {
    const { branch: currentBranchId, company, accessToken, refreshToken, setSession } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [branches, setBranches] = useState<BranchInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentBranch, setCurrentBranch] = useState<BranchInfo | null>(null);
    const [error, setError] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setIsLoading(true);
                const response = await getBranches();
                setBranches(response.items?.sort((a, b) => a?.name?.localeCompare(b?.name)));

                const current = response.items.find(b => b.id === currentBranchId);
                if (current) {
                    setCurrentBranch(current);
                }
            } catch (err) {
                setError('Failed to load branches');
                console.error('Error fetching branches:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBranches();
    }, [currentBranchId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleBranchSwitch = async (branchId: string) => {
        if (branchId === currentBranchId) {
            setIsOpen(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/sign-in/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken,
                    refreshToken,
                    company,
                    branch: branchId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to switch branch');
            }

            const data = await response.json();
            setSession(data);
            setIsOpen(false);

            const selected = branches.find(b => b.id === branchId);
            if (selected) {
                setCurrentBranch(selected);
            }
        } catch (err) {
            setError('Failed to switch branch');
            console.error('Error switching branch:', err);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="relative group" ref={dropdownRef}>
            {error && (
                <div className="absolute top-full right-0 mt-1 p-2 text-sm text-red-600 bg-red-100 rounded-md z-50">
                    {error}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-50 text-blue-700 transition-colors group relative"
                aria-label="Switch branch"
            >
                {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                    <>
                        {currentBranch?.logo ? (
                            <div className="w-8 h-8 relative overflow-hidden rounded-md">
                                <Image
                                    src={currentBranch.logo}
                                    alt={currentBranch.name || currentBranch.id}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500">
                                <div className="text-sm font-medium">{currentBranch?.orderprefix}</div>
                            </div>
                        )}
                        <span className="hidden sm:flex text-start text-wrap font-medium">
                            {currentBranch?.name || currentBranchId || 'Branch'}
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                )}
                <span
                    className="absolute top-full mt-1 w-32 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity text-center z-50">
                    Switch Branch
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-64 max-h-96 overflow-y-auto bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        <div className="px-3 py-2 text-sm font-medium text-gray-500 border-b">
                            Select Branch
                        </div>
                        {branches.map((branch) => (
                            <button
                                key={branch.id}
                                onClick={() => handleBranchSwitch(branch.id)}
                                className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                                    branch.id === currentBranchId ? 'bg-blue-50 text-blue-600' : 'text-gray-800'
                                }`}
                            >
                                {branch.logo ? (
                                    <div className="w-8 h-8 relative overflow-hidden rounded-md">
                                        <Image
                                            src={branch.logo}
                                            alt={branch.name || branch.id}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 text-gray-500">
                                        <div className="text-sm font-medium">{branch.orderprefix}</div>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate text-wrap text-start">
                                        {branch.name || branch.id}
                                    </div>
                                </div>
                                {branch.id === currentBranchId && (
                                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
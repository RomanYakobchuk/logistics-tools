'use client';

import { useState, useEffect } from 'react';

interface UseCaseInfo {
    value: string;
    label: string;
    description: string;
    icon: JSX.Element;
    examples: string[];
    benefits: string[];
}

const useCaseInfoData: UseCaseInfo[] = [
    {
        value: 'marketing',
        label: 'Marketing',
        description: 'Promotional SMS campaigns for reaching customers with special offers, new products, and marketing messages.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
        ),
        examples: [
            'Flash sale announcements',
            'New product launches',
            'Seasonal promotions',
            'Customer loyalty programs',
            'Event marketing'
        ],
        benefits: [
            'High open rates',
            'Immediate delivery',
            'Cost-effective reach',
            'Personalized messaging'
        ]
    },
    {
        value: 'notifications',
        label: 'Notifications',
        description: 'System and app notifications to keep users informed about important updates and activities.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
        examples: [
            'Account updates',
            'Password reset alerts',
            'Subscription renewals',
            'App updates',
            'Important system messages'
        ],
        benefits: [
            'Keeps users engaged',
            'Reduces support tickets',
            'Improves user experience',
            'Automated delivery'
        ]
    },
    {
        value: 'verification',
        label: 'Verification',
        description: 'Secure one-time passwords (OTP) and verification codes for user authentication and account security.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        examples: [
            'Two-factor authentication',
            'Login verification codes',
            'Transaction confirmations',
            'Account registration OTP',
            'Identity verification'
        ],
        benefits: [
            'Enhanced security',
            'Fraud prevention',
            'User identity protection',
            'Compliance ready'
        ]
    },
    {
        value: 'alerts',
        label: 'System Alerts',
        description: 'Critical system notifications for downtime, emergencies, and important operational updates.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        examples: [
            'System maintenance alerts',
            'Security breach notifications',
            'Service interruptions',
            'Emergency announcements',
            'Critical bug fixes'
        ],
        benefits: [
            'Immediate delivery',
            'High priority messaging',
            'Reliable communication',
            'Crisis management'
        ]
    },
    {
        value: 'customer_service',
        label: 'Customer Service',
        description: 'Two-way communication for customer support, helpdesk, and service-related interactions.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        examples: [
            'Customer support chat',
            'Appointment reminders',
            'Service status updates',
            'Feedback collection',
            'Issue resolution'
        ],
        benefits: [
            'Instant communication',
            'Reduced call volume',
            'Better customer satisfaction',
            'Efficient support'
        ]
    },
    {
        value: 'other',
        label: 'Other',
        description: 'Custom SMS services for specialized use cases not covered by standard categories.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        ),
        examples: [
            'Custom workflows',
            'Industry-specific alerts',
            'Integration messages',
            'Internal communications',
            'Special purpose SMS'
        ],
        benefits: [
            'Flexibility',
            'Customizable features',
            'Tailored solutions',
            'Unique use cases'
        ]
    }
];

interface UseCaseInfoModalProps {
    selectedUseCase?: string;
}

export default function UseCaseInfoModal({ selectedUseCase }: UseCaseInfoModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    // Handle escape key press
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Handle click outside modal
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            {/* Info Button */}
            <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                title="Learn about use cases"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>

            {/* Modal Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

                    {/* Modal Content */}
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <div
                            className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all w-full max-w-3xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    SMS Service Use Cases Guide
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="ml-2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-6">
                                    Each use case is optimized for specific types of SMS communication. Choose the one that best fits your needs.
                                </p>

                                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                    {useCaseInfoData.map((useCase) => (
                                        <div
                                            key={useCase.value}
                                            className={`border rounded-lg p-4 ${
                                                selectedUseCase === useCase.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            } transition-colors`}
                                        >
                                            <div className="flex items-start">
                                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                    selectedUseCase === useCase.value
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {useCase.icon}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h4 className="text-base font-medium text-gray-900">
                                                        {useCase.label}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {useCase.description}
                                                    </p>

                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                                                                Examples
                                                            </h5>
                                                            <ul className="mt-1 text-sm text-gray-600">
                                                                {useCase.examples.map((example, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <span className="text-gray-400 mr-2">•</span>
                                                                        <span>{example}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                                                                Benefits
                                                            </h5>
                                                            <ul className="mt-1 text-sm text-gray-600">
                                                                {useCase.benefits.map((benefit, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <span className="text-green-400 mr-2">✓</span>
                                                                        <span>{benefit}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                    onClick={closeModal}
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { useService } from '@/lib/campaign/service-context';
import { purchaseAndAssignPhoneNumbers } from '@/lib/api/sms-service';
import {IAvailableNumber, IPhoneNumberPurchaseResponse} from '@/interfaces/sms';
import PhoneNumberSearch from "@/components/krews/numbers/SearchNumbers";
import SelectedNumbersList from "@/components/krews/numbers/SelectedNumbersList";

export default function PhoneNumberPurchaseWizard() {
    const router = useRouter();
    const { campaign } = useCampaign();
    const { service } = useService();

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedNumbers, setSelectedNumbers] = useState<IAvailableNumber[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [purchaseResult, setPurchaseResult] = useState<IPhoneNumberPurchaseResponse | null>(null);

    const handleStepNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleStepBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleBack = () => {
        router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers`);
    };

    const handleNumberSelection = (numbers: IAvailableNumber[]) => {
        setSelectedNumbers(numbers);
    };

    const handlePurchaseAndAssign = async () => {
        if (!campaign || !service || selectedNumbers.length === 0) return;

        setIsProcessing(true);
        setError(null);

        try {
            const result = await purchaseAndAssignPhoneNumbers(
                campaign.friendlyName,
                selectedNumbers?.map((s) => s?.phoneNumber),
                service.sid
            );

            setPurchaseResult(result);

            // If successful, redirect after a brief delay
            if (result.operation === 'reserve_and_assign' && result.summary.assigned && result.summary.assigned > 0) {
                setTimeout(() => {
                    router.push(`/krews/campaigns/${campaign.friendlyName}/services/${service.sid}/numbers`);
                }, 3000);
            }
            /*eslint-disable*/
        } catch (err: any) {
            /*eslint-enable*/
            console.error('Error purchasing numbers:', err);
            setError(err.message || 'Failed to purchase and assign phone numbers');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!campaign || !service) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Missing Information</h3>
                <p className="text-gray-600">Unable to load campaign or service details.</p>
            </div>
        );
    }

    const handleRemoveNumber = (phoneNumber: IAvailableNumber) => {
        setSelectedNumbers(prev => prev.filter(num => num?.phoneNumber !== phoneNumber?.phoneNumber));
    };

    const clearAllSelectedNumbers = () => {
        setSelectedNumbers([]);
    };

    return (
        <div className="w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center mb-4">
                    <button
                        onClick={handleBack}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to numbers
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">Add Phone Numbers</h1>
                <p className="text-gray-600 mt-1">
                    Purchase and assign phone numbers to {service.friendlyName}
                </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-center">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                currentStep >= step
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-300'
                            }`}>
                                {currentStep > step ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="text-sm font-medium">{step}</span>
                                )}
                            </div>
                            {step < 3 && (
                                <div className={`w-20 h-0.5 mx-2 ${
                                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between max-w-xs mx-auto text-center mt-2 whitespace-break-spaces">
                    <span className="text-sm text-gray-600">Get{`\n`}Started</span>
                    <span className="text-sm text-gray-600">Select{`\n`}Numbers</span>
                    <span className="text-sm text-gray-600">Confirm{`\n`}Purchase</span>
                </div>
            </div>

            {/* Step 1: Introduction */}
            {currentStep === 1 && (
                <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Purchase Phone Numbers</h2>
                        <p className="text-gray-600 mt-2">
                            You&apos;re about to purchase and assign phone numbers to <span className="font-medium">{service.friendlyName}</span>.
                        </p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>1. Search and select available phone numbers</li>
                            <li>2. Review your selection and pricing</li>
                            <li>3. Confirm purchase and automatic assignment to your service</li>
                        </ul>
                    </div>

                    <button
                        onClick={handleStepNext}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            )}

            {/* Step 2: Select Numbers */}
            {currentStep === 2 && (
                <div className="bg-gray-100 rounded-lg shadow-md p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Select Phone Numbers</h2>
                        <p className="text-gray-600 mt-1">
                            Search and select phone numbers to purchase for your service
                        </p>
                    </div>

                    <PhoneNumberSearch
                        mode="select"
                        onSelectNumbers={handleNumberSelection}
                        initialSelectedNumbers={selectedNumbers}
                    />

                    <div className="mt-6 flex justify-between">
                        <button
                            onClick={handleStepBack}
                            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleStepNext}
                            disabled={selectedNumbers.length === 0}
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue ({selectedNumbers.length} selected)
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Confirm Purchase */}
            {currentStep === 3 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Confirm Purchase</h2>
                        <p className="text-gray-600 mt-1">
                            Review the selected numbers before making the purchase
                        </p>
                    </div>

                    {purchaseResult ? (
                        // Show purchase results
                        <div className="space-y-6">
                            {purchaseResult.operation === 'reserve_and_assign' && purchaseResult.summary.assigned && purchaseResult.summary.assigned > 0 && (
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">Success!</h3>
                                            <div className="mt-2 text-sm text-green-700">
                                                <p>Successfully purchased and assigned {purchaseResult.summary.assigned} phone number(s) to {service.friendlyName}.</p>
                                                <p className="mt-1">Redirecting you back to the numbers page...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Successfully Assigned Numbers */}
                            {purchaseResult.operation === 'reserve_and_assign' && purchaseResult.details.successfullyAssigned.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Successfully Assigned Numbers</h3>
                                    <div className="bg-green-50 rounded-md p-4">
                                        <ul className="text-sm text-green-700 space-y-1">
                                            {purchaseResult.details.successfullyAssigned.map((result, index) => (
                                                <li key={index}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {result.phoneNumber} (SID: {result.sid})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Failed Purchases */}
                            {purchaseResult.operation === 'reserve_and_assign' && purchaseResult.details.failedPurchases.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Failed Purchases</h3>
                                    <div className="bg-red-50 rounded-md p-4">
                                        <ul className="text-sm text-red-700 space-y-1">
                                            {purchaseResult.details.failedPurchases.map((result, index) => (
                                                <li key={index}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    {result.phoneNumber}: {result.error}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Unavailable Numbers */}
                            {purchaseResult.operation === 'reserve_and_assign' && purchaseResult.details.unavailableNumbers.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Unavailable Numbers</h3>
                                    <div className="bg-yellow-50 rounded-md p-4">
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            {purchaseResult.details.unavailableNumbers.map((number, index) => (
                                                <li key={index}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                    {number}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show selected numbers before purchase
                        <div className="space-y-6">
                            <div>
                                {selectedNumbers.length > 0 && (
                                    <SelectedNumbersList
                                        selectedNumbers={selectedNumbers}
                                        onRemoveNumber={handleRemoveNumber}
                                        onClearAll={clearAllSelectedNumbers}
                                    />
                                )}
                                {/*<h3 className="text-sm font-medium text-gray-900 mb-2">Selected Numbers ({selectedNumbers.length})</h3>*/}
                                {/*<div className="bg-gray-50 rounded-lg p-4">*/}
                                {/*    <ul className="text-sm text-gray-700 space-y-1">*/}
                                {/*        {selectedNumbers.map((number, index) => (*/}
                                {/*            <li key={index}>{number}</li>*/}
                                {/*        ))}*/}
                                {/*    </ul>*/}
                                {/*</div>*/}
                            </div>

                            {error && (
                                <div className="bg-red-50 rounded-md p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    onClick={handleStepBack}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePurchaseAndAssign}
                                    disabled={isProcessing || selectedNumbers.length <= 0}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : `Purchase & Assign ${selectedNumbers.length} Numbers`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
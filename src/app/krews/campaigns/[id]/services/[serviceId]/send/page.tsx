'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/auth/require-auth';
import { useCampaign } from '@/lib/campaign/campaign-context';
import { useService } from '@/lib/campaign/service-context';
import { getNumbers, sendSms } from '@/lib/api/sms-service';

interface PhoneNumber {
    phoneNumber: string;
    friendlyName: string;
}

export default function SendSmsPage() {
    const router = useRouter();
    const { campaign } = useCampaign();
    const { service } = useService();

    const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
    const [isLoadingPhoneNumbers, setIsLoadingPhoneNumbers] = useState(false);
    const [selectedFromNumber, setSelectedFromNumber] = useState<PhoneNumber | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [toNumber, setToNumber] = useState('');
    const [formattedToNumber, setFormattedToNumber] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [numberError, setNumberError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const charactersLeft = 160 - message.length;

    useEffect(() => {
        if (service) {
            loadPhoneNumbers();
        }
    }, [service]);

    useEffect(() => {
        // Обробка кліків поза межами дропдауну
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadPhoneNumbers = async () => {
        if (!campaign || !service) return;

        setIsLoadingPhoneNumbers(true);
        setError(null);

        try {
            const response = await getNumbers(campaign.friendlyName, service.sid);
            setPhoneNumbers(response.items || []);

            if (response.items && response.items.length > 0) {
                setSelectedFromNumber(response.items[0]);
            }
        } catch (err) {
            console.error('Error loading phone numbers:', err);
            setError('Failed to load phone numbers. Please try again.');
        } finally {
            setIsLoadingPhoneNumbers(false);
        }
    };

    const validatePhoneNumber = (phoneNumber: string): boolean => {
        // Видалити всі нецифрові символи для валідації
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        // Для США/Канади - номер повинен містити 10 або 11 цифр (з кодом країни)
        if (digitsOnly.length === 10) {
            return true;
        } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
            return true;
        }

        return false;
    };

    const formatPhoneNumber = (phoneNumber: string): string => {
        // Видалити всі нецифрові символи для форматування
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        // Форматуємо номер в залежності від довжини
        if (digitsOnly.length <= 3) {
            return digitsOnly;
        } else if (digitsOnly.length <= 6) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
        } else if (digitsOnly.length <= 10) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
        } else {
            // Якщо номер з кодом країни (11 цифр)
            return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Зберігаємо вхідне значення для відображення у полі вводу
        setFormattedToNumber(inputValue);

        // Видаляємо всі нецифрові символи для збереження фактичного номера
        const digitsOnly = inputValue.replace(/\D/g, '');

        // Якщо введено коректний номер, додаємо "+" перед кодом країни
        if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
            setToNumber(`+${digitsOnly}`);
        } else if (digitsOnly.length === 10) {
            // Для 10-цифрового номера додаємо код країни США/Канади
            setToNumber(`+1${digitsOnly}`);
        } else {
            setToNumber(digitsOnly);
        }

        // Валідація номера
        if (inputValue.length > 0) {
            if (!validatePhoneNumber(digitsOnly)) {
                setNumberError('Please enter a valid US or Canadian phone number (10 digits)');
            } else {
                setNumberError(null);
            }
        } else {
            setNumberError(null);
        }
    };

    const handleSendSms = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!campaign || !service || !selectedFromNumber || !toNumber || !message) {
            setError('Please fill in all fields');
            return;
        }

        if (numberError) {
            setError('Please correct the phone number before sending');
            return;
        }

        setIsSending(true);
        setError(null);
        setSuccess(null);

        try {
            await sendSms({
                from: selectedFromNumber.phoneNumber,
                to: toNumber,
                message,
                campaignId: campaign.friendlyName,
                serviceSid: service.sid
            });

            setSuccess('SMS sent successfully!');
            setFormattedToNumber('');
            setToNumber('');
            setMessage('');
        } catch (err) {
            console.error('Error sending SMS:', err);
            setError('Failed to send SMS. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const selectPhoneNumber = (number: PhoneNumber) => {
        setSelectedFromNumber(number);
        setIsDropdownOpen(false);
    };

    const onFocusFormatting = () => {
        if (toNumber && validatePhoneNumber(toNumber)) {
            const formatted = formatPhoneNumber(toNumber);
            setFormattedToNumber(formatted);
        }
    };

    return (
        <RequireAuth>
            <div className="py-6 max-w-4xl mx-auto">
                <div className="flex items-center mb-2">
                    <button
                        onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}`)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 19l-7-7 7-7"/>
                        </svg>
                        Back to service
                    </button>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                            {success}
                        </div>
                    )}

                    {isLoadingPhoneNumbers ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : phoneNumbers.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Phone Numbers Available</h3>
                            <p className="text-gray-600 mb-4">
                                You need to add phone numbers to this service before you can send SMS messages.
                            </p>
                            <button
                                onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Go Back to Service
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSendSms} className="space-y-6">
                            {/* Кастомний дропдаун для вибору номера */}
                            <div>
                                <label htmlFor="fromNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    From Number
                                </label>
                                <div ref={dropdownRef} className="relative">
                                    <button
                                        type="button"
                                        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        onClick={toggleDropdown}
                                        aria-haspopup="listbox"
                                        aria-expanded={isDropdownOpen}
                                    >
                                        {selectedFromNumber ? (
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3 truncate">
                                                    <p className="text-sm font-medium text-gray-900">{selectedFromNumber.friendlyName}</p>
                                                    <p className="text-xs text-gray-500">{selectedFromNumber.phoneNumber}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Select a phone number</span>
                                        )}
                                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                            <svg className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                            <div className="p-2 sticky top-0 bg-white border-b">
                                                <div className="text-xs font-medium text-gray-500">Select From Number</div>
                                            </div>
                                            <ul tabIndex={-1} role="listbox" aria-labelledby="fromNumber" className="py-1">
                                                {phoneNumbers.map((number) => (
                                                    <li
                                                        key={number.phoneNumber}
                                                        role="option"
                                                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50 ${selectedFromNumber?.phoneNumber === number.phoneNumber ? 'bg-blue-100' : ''}`}
                                                        onClick={() => selectPhoneNumber(number)}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                                </svg>
                                                            </div>
                                                            <div className="ml-3 truncate">
                                                                <p className="text-sm font-medium text-gray-900">{number.friendlyName}</p>
                                                                <p className="text-xs text-gray-500">{number.phoneNumber}</p>
                                                            </div>
                                                        </div>
                                                        {selectedFromNumber?.phoneNumber === number.phoneNumber && (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="toNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    To Number
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="toNumber"
                                        type="text"
                                        value={formattedToNumber}
                                        onChange={handlePhoneNumberChange}
                                        onFocus={onFocusFormatting}
                                        placeholder="(555) 123-4567"
                                        className={`block w-full pl-10 pr-3 py-2.5 border ${numberError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none`}
                                        required
                                    />
                                    {toNumber && !numberError && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {numberError && (
                                    <p className="mt-1 text-sm text-red-600">{numberError}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter a 10-digit US or Canadian phone number, e.g. (555) 123-4567
                                </p>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Message
                                    </label>
                                    <span className={`text-xs ${charactersLeft < 0 ? 'text-red-600 font-medium' : charactersLeft < 20 ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
                                        {charactersLeft} characters left
                                    </span>
                                </div>
                                <div className="relative">
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        maxLength={160}
                                        rows={5}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => router.push(`/krews/campaigns/${campaign?.friendlyName}/services/${service?.sid}/numbers`)}
                                    className="px-4 py-2.5 mr-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSending || message.length === 0 || toNumber.length === 0 || !!numberError || !selectedFromNumber}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSending ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : 'Send SMS'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
}
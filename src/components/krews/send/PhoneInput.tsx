'use client';

import { useState, useEffect } from 'react';

interface PhoneInputProps {
    value: string;
    onChange: (value: string, formattedValue: string, isValid: boolean) => void;
    disabled?: boolean;
}

export default function PhoneInput({ value, onChange, disabled = false }: PhoneInputProps) {
    const [formattedValue, setFormattedValue] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setFormattedValue('');
        }
    }, [value]);

    const validatePhoneNumber = (phoneNumber: string): boolean => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        if (digitsOnly.length === 10) {
            return true;
        } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
            return true;
        }

        return false;
    };

    const formatPhoneNumber = (phoneNumber: string): string => {
        const digitsOnly = phoneNumber.replace(/\D/g, '');

        if (digitsOnly.length <= 3) {
            return digitsOnly;
        } else if (digitsOnly.length <= 6) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`;
        } else if (digitsOnly.length <= 10) {
            return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
        } else {
            return `+${digitsOnly.slice(0, 1)} (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setFormattedValue(inputValue);

        const digitsOnly = inputValue.replace(/\D/g, '');

        let formattedNumber = '';
        if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
            formattedNumber = `+${digitsOnly}`;
        } else if (digitsOnly.length === 10) {
            formattedNumber = `+1${digitsOnly}`;
        } else {
            formattedNumber = digitsOnly;
        }

        let isValid = false;
        if (inputValue.length > 0) {
            if (!validatePhoneNumber(digitsOnly)) {
                setError('Please enter a valid US or Canadian phone number (10 digits)');
            } else {
                setError(null);
                isValid = true;
            }
        } else {
            setError(null);
        }

        onChange(formattedNumber, inputValue, isValid);
    };

    const onFocusFormatting = () => {
        if (value && validatePhoneNumber(value)) {
            const formatted = formatPhoneNumber(value);
            setFormattedValue(formatted);
        }
    };

    return (
        <div className="space-y-1">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                To Number
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
                <input
                    id="phoneNumber"
                    type="text"
                    value={formattedValue}
                    onChange={handleInputChange}
                    onFocus={onFocusFormatting}
                    placeholder="(555) 123-4567"
                    className={`block w-full pl-10 pr-10 py-2.5 border ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    required
                    disabled={disabled}
                />
                {value && !error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            <p className="mt-1 text-xs text-gray-500">
                Enter a 10-digit US or Canadian phone number, e.g. (555) 123-4567
            </p>
        </div>
    );
}
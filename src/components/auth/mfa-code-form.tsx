'use client';

import { useState, useEffect, FormEvent, ClipboardEvent, KeyboardEvent } from 'react';

interface MfaCodeFormProps {
    email: string;
    session: string;
    isLoading: boolean;
    error: string;
    onSubmit: (code: string, rememberDevice: boolean) => void;
    onBack: () => void;
}

export default function MfaCodeForm({
                                        email,
                                        isLoading,
                                        error,
                                        onSubmit,
                                        onBack
                                    }: MfaCodeFormProps) {
    const [code, setCode] = useState<string>('');
    const [rememberDevice, setRememberDevice] = useState<boolean>(true);

    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
    const [activeDigitIndex, setActiveDigitIndex] = useState<number>(0);

    useEffect(() => {
        setCode(digits.join(''));
    }, [digits]);

    const handleDigitChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newDigits = [...digits];

        if (value.length > 1) {
            const pastedDigits = value.split('').slice(0, 6);
            const updatedDigits = [...digits];

            pastedDigits.forEach((digit, idx) => {
                if (index + idx < 6) {
                    updatedDigits[index + idx] = digit;
                }
            });

            setDigits(updatedDigits);
            setActiveDigitIndex(Math.min(index + pastedDigits.length, 5));
            return;
        }

        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 5) {
            setActiveDigitIndex(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            if (digits[index] === '') {
                if (index > 0) {
                    setActiveDigitIndex(index - 1);
                }
            } else {
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
            }
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            setActiveDigitIndex(index - 1);
        }
        if (e.key === 'ArrowRight' && index < 5) {
            setActiveDigitIndex(index + 1);
        }
    };

    useEffect(() => {
        const inputElement = document.getElementById(`digit-${activeDigitIndex}`);
        if (inputElement) {
            inputElement.focus();
        }
    }, [activeDigitIndex]);

    const handleSubmit = (e?: FormEvent) => {
        if (e) e.preventDefault();

        if (code.length !== 6) {
            return;
        }

        onSubmit(code, rememberDevice);
    };

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const pastedDigits = pastedData.replace(/\D/g, '').slice(0, 6);

        if (pastedDigits) {
            const newDigits = [...digits];
            pastedDigits.split('').forEach((digit, index) => {
                if (index < 6) {
                    newDigits[index] = digit;
                }
            });

            setDigits(newDigits);
            setActiveDigitIndex(Math.min(pastedDigits.length, 5));
        }
    };

    const renderDigitInputs = () => (
        <div className="flex justify-center space-x-2">
            {digits.map((digit, index) => (
                <input
                    key={index}
                    id={`digit-${index}`}
                    type="text"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    autoComplete="one-time-code"
                />
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Verification Code</h1>
                <p className="mt-2 text-gray-600">
                    Enter the 6-digit code sent to your email
                </p>
                <p className="mt-1 text-sm text-gray-500">{email}</p>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {renderDigitInputs()}

                <div className="flex items-center">
                    <input
                        id="remember-device"
                        name="remember-device"
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="remember-device" className="block ml-2 text-sm text-gray-900">
                        Remember this device
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading || code.length !== 6}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                </div>
            </form>
        </div>
    );
}
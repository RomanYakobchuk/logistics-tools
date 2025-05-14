'use client';

interface MessageInputProps {
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    disabled?: boolean;
}

export default function MessageInput({
                                         value,
                                         onChange,
                                         maxLength = 160,
                                         disabled = false
                                     }: MessageInputProps) {
    const charactersLeft = maxLength - value.length;
    const isWarning = charactersLeft < 20 && charactersLeft >= 0;
    const isError = charactersLeft < 0;

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <span
                    className={`text-xs font-medium ${
                        isError
                            ? 'text-red-600'
                            : isWarning
                                ? 'text-yellow-600'
                                : 'text-gray-500'
                    }`}
                >
                    {charactersLeft} characters left
                </span>
            </div>

            <div className="relative rounded-md shadow-sm">
                <textarea
                    id="message"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={maxLength}
                    rows={5}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    disabled={disabled}
                />

                <div className="absolute bottom-2 right-2 pointer-events-none">
                    {isWarning && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>

            <div className="flex justify-between">
                <p className="text-xs text-gray-500">
                    Standard SMS message limit is 160 characters
                </p>

                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    disabled={disabled || value.length === 0}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
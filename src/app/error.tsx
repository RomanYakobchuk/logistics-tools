'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-16">
            <div className="text-center space-y-6 max-w-lg mx-auto px-4">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-red-100">
                        <AlertCircle className="h-12 w-12 text-red-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Something went wrong!</h1>
                <p className="text-gray-600">
                    {error.message || 'An unexpected error occurred. Please try again later.'}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <RotateCcw className="h-5 w-5" />
                        <span>Try again</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
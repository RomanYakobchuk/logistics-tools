'use client';

interface LoadingErrorStateProps {
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

export default function LoadingErrorState({
                                              isLoading,
                                              error,
                                              onRetry,
                                          }: LoadingErrorStateProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-md">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return null;
}

export function EmptyState({ message, children }: { message: string, children?: React.ReactNode }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            {children}
        </div>
    );
}
import Link from 'next/link';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center -mt-16">
            <div className="text-center space-y-6 max-w-lg mx-auto px-4">
                <h1 className="text-9xl font-bold text-blue-800">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="text-gray-600">
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <HomeIcon className="h-5 w-5" />
                    <span>Return Home</span>
                </Link>
            </div>
        </div>
    );
}
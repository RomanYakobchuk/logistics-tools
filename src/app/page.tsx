import Link from 'next/link';
import {MapPin, FileSpreadsheet} from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] overflow-hidden">
            <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center">
                Welcome to Logistics Tools
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/*<Link*/}
                {/*    href="/distance-calculation"*/}
                {/*    className="group flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"*/}
                {/*>*/}
                {/*    <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">*/}
                {/*        <MapPin className="h-8 w-8 text-blue-600"/>*/}
                {/*    </div>*/}
                {/*    <h2 className="text-2xl font-semibold text-blue-800 mt-4 mb-2">*/}
                {/*        Drive Distance Calculator (Only Here api)*/}
                {/*    </h2>*/}
                {/*    <p className="text-gray-600 text-center">*/}
                {/*        Calculate accurate driving distances between locations.*/}
                {/*    </p>*/}
                {/*</Link>*/}
                <Link
                    href="/drive-distance"
                    className="group flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <MapPin className="h-8 w-8 text-blue-600"/>
                    </div>
                    <h2 className="text-2xl font-semibold text-blue-800 mt-4 mb-2">
                        Drive Distance Calculator
                    </h2>
                    <p className="text-gray-600 text-center">
                        Calculate accurate driving distances between locations using multiple routing services.
                    </p>
                </Link>

                <Link
                    href="/orders-data"
                    className="group flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <FileSpreadsheet className="h-8 w-8 text-blue-600"/>
                    </div>
                    <h2 className="text-2xl font-semibold text-blue-800 mt-4 mb-2">
                        Test Orders Data Generator
                    </h2>
                    <p className="text-gray-600 text-center">
                        Generate sample CSV data for testing logistics operations and order processing.
                    </p>
                </Link>
                {/*<Link*/}
                {/*    href="/test-write-data"*/}
                {/*    className="group flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"*/}
                {/*>*/}
                {/*    <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">*/}
                {/*        <Edit className="h-8 w-8 text-blue-600"/>*/}
                {/*    </div>*/}
                {/*    <h2 className="text-2xl font-semibold text-blue-800 mt-4 mb-2">*/}
                {/*        Test Write Data*/}
                {/*    </h2>*/}
                {/*    <p className="text-gray-600 text-center">*/}
                {/*        Test form with focus-triggered API calls for data editing and validation.*/}
                {/*    </p>*/}
                {/*</Link>*/}
                {/*<Link*/}
                {/*    href="/uploads"*/}
                {/*    className="group flex flex-col items-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"*/}
                {/*>*/}
                {/*    <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">*/}
                {/*        <File className="h-8 w-8 text-blue-600"/>*/}
                {/*    </div>*/}
                {/*    <h2 className="text-2xl font-semibold text-blue-800 mt-4 mb-2">*/}
                {/*        Uploads*/}
                {/*    </h2>*/}
                {/*</Link>*/}
            </div>
        </div>
    );
}
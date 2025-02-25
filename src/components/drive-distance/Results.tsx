'use client'

import {ILocation, IRouteResults} from '@/types';
import {XOctagon, Loader2} from 'lucide-react';
import dynamic from "next/dynamic";

const GraphhoperRoute = dynamic(() => import("@/components/drive-distance/GraphhoperRoute"), {ssr: false});
const GeoapifyRoute = dynamic(() => import("@/components/drive-distance/GeoapifyRoute"), {ssr: false});
const GoogleRoute = dynamic(() => import("@/components/drive-distance/GoogleRoute"), {ssr: false});
const HERERouteDisplay = dynamic(() => import("@/components/drive-distance/HERERouteDisplay"), {ssr: false});

interface Props {
    results: IRouteResults | null;
    loading: boolean;
    error: string | null;
    origin: ILocation,
    destination: ILocation
}

interface ResultSectionProps {
    title: string;
    // data: IRouteService | undefined;
    distance?: number;
    duration?: string;
    bgColor: string;
    error?: string;
    details?: string;
    executionTime?: number;
}

export function ResultSection({title, distance, duration, details, executionTime, error, bgColor}: ResultSectionProps) {
    const sectionClasses = `${bgColor} p-4 rounded-lg w-full`;

    if (error) {
        return (
            <div className={sectionClasses}>
                <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
                <div className="flex items-center gap-2 text-red-500">
                    <XOctagon className="h-5 w-5"/>
                    <span className="font-medium">{error || 'Service unavailable'}</span>
                </div>
                {details && (
                    <div className="mt-2 text-sm text-red-400">
                        {details}
                    </div>
                )}
                {executionTime && (
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Execution time: </span> {executionTime}ms
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={sectionClasses}>
            <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
            <div className="space-y-2">
                <p className="text-gray-700">
                    <span className="font-medium">Distance: </span>
                    {distance || 0} miles
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Time: </span>
                    {duration}
                </p>
                {
                    executionTime && (
                        <p className="text-gray-700">
                            <span className="font-medium">Execution time: </span>
                            {executionTime}ms
                        </p>
                    )
                }
            </div>
        </div>
    );
}

export const LoadingResult = ({service}: { service: string }) => {
    return (
        <div className="bg-blue-50 p-4 rounded-lg w-full">
            <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin"/>
                <div className="text-blue-700">Loading {service} results...</div>
            </div>
        </div>
    )
}
export const ErrorResult = ({error}: { error: string | { message: string, description?: string } }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3 bg-red-50 p-4 rounded-lg">
                <XOctagon className="h-5 w-5 text-red-500"/>
                {
                    typeof error === 'string'
                        ? <span className="text-red-700 font-medium">{error}</span>
                        : <div className={'space-y-2'}>
                            <span className="text-red-700 font-medium">{error?.message}</span>
                            {
                                error?.description && (
                                    <p className="text-gray-700 font-medium text-sm">{error?.description}</p>
                                )
                            }
                        </div>
                }
            </div>
        </div>
    )
}

function Results({results, loading, error, origin, destination}: Props) {

    if (loading) {
        return (
            <div className="gap-4 w-full grid grid-cols-1 lg:grid-cols-2">
                {['GraphHopper', 'HERE', 'GeoApify', 'Google'].map((service) => (
                    <LoadingResult service={service} key={service}/>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <ErrorResult error={error}/>
        );
    }


    if (!results) {
        return (
            <div className="text-gray-600">
                Waiting for input...
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-4 w-full lg:flex-row lg:flex-wrap">
                {results.totalExecutionTime && (
                    <div className="w-full mb-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">
                                <span className="font-medium">Total execution time: </span>
                                {results.totalExecutionTime}ms
                            </p>
                        </div>
                    </div>
                )}
                <div className={'grid gap-4 grid-cols-1 lg:grid-cols-2 w-full'}>
                    <div className={'w-full flex flex-col gap-4'}>
                        <ResultSection
                            title="GraphHopper"
                            distance={results.graph?.distanceMiles}
                            error={results.graph?.error}
                            details={results.graph?.details}
                            duration={results.graph?.duration}
                            executionTime={results.graph?.executionTime}
                            bgColor="bg-blue-50"
                        />
                        {
                            results.graph?.allData && (
                                <GraphhoperRoute route={results.graph?.allData}/>
                            )
                        }
                    </div>
                    <div className={'w-full flex flex-col gap-4'}>
                        <ResultSection
                            title="HERE"
                            distance={results.here?.distanceMiles}
                            error={results.here?.error}
                            details={results.here?.details}
                            duration={results.here?.duration}
                            executionTime={results.here?.executionTime}
                            bgColor="bg-green-50"
                        />
                        {
                            results.here?.allData?.routes[0] && (
                                <HERERouteDisplay route={results.here?.allData?.routes[0]}/>
                            )
                        }
                    </div>
                    <div className={'w-full flex flex-col gap-4'}>
                        <ResultSection
                            title="GeoApify"
                            distance={results.geoApify?.distanceMiles}
                            error={results.geoApify?.error}
                            details={results.geoApify?.details}
                            duration={results.geoApify?.duration}
                            executionTime={results.geoApify?.executionTime}
                            bgColor="bg-purple-50"
                        />
                        {
                            results?.geoApify?.allData && (
                                <GeoapifyRoute route={results.geoApify.allData}/>
                            )
                        }
                    </div>
                    <div className={'w-full flex flex-col gap-4'}>
                        <ResultSection
                            title="Google"
                            distance={results.google?.distanceMiles}
                            error={results.google?.error}
                            details={results.google?.details}
                            duration={results.google?.duration}
                            executionTime={results.google?.executionTime}
                            bgColor="bg-yellow-50"
                        />
                        {
                            results?.google?.allData?.routes[0] && (
                                <GoogleRoute
                                    route={results.google?.allData?.routes[0]}
                                    origin={{
                                        latitude: Number(origin.latitude || 0) || 0,
                                        longitude: Number(origin.longitude || 0) || 0,
                                    }}
                                    destination={{
                                        latitude: Number(destination.latitude || 0) || 0,
                                        longitude: Number(destination.longitude || 0) || 0,
                                    }}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;
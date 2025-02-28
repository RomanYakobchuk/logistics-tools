'use client';

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";

import {ErrorResult, LoadingResult, ResultSection} from "@/components/drive-distance/Results";
import {LocationSelector, TransportModeSelector} from "@/components/drive-distance";
import {ILocation, IRouteService, TransportMode} from "@/types";

const HERERouteDisplayByCoordinates = dynamic(() => import("@/components/drive-distance/HERERouteDisplayByCoordinates"), {ssr: false});

const API = (process.env.NEXT_PUBLIC_DRIVE_DISTANCE_API || "");

const DriveDistancePage = () => {
    const [origin, setOrigin] = useState<ILocation | null>(null);
    const [destination, setDestination] = useState<ILocation | null>(null);
    const [transportMode, setTransportMode] = useState<TransportMode>('truck');
    const [result, setResult] = useState<IRouteService | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string, description?: string } | null>(null);

    const destinationInputRef = useRef<HTMLInputElement | null>(null);

    const calculateRoute = async (origin: ILocation | null, destination: ILocation | null) => {
        if (!origin || !destination) {
            setError({
                message: "Please select valid locations",
            });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const routes = JSON.stringify([
                {
                    origin: {
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                    },
                    destination:  {
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                    },
                    // transportMode: transportMode,
                    // coordinates: true
                },
                {
                    destination:  {
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                    },
                    origin: {
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                    },
                    transportMode: transportMode,
                    coordinates: true
                },
            ])
            const response = await fetch(
                `${API}?routes=${routes}`
            );
            const data = await response.json();

            console.log('HERE response: ', data)
            if (data?.statusCode && data?.statusCode !== 200) {
                setError({
                    message: data?.message,
                    description: `${Object.keys(data?.info)[0]}: ${data?.info[Object.keys(data?.info)[0]]}` || ""
                });
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError({
                message: 'Failed to calculate distance'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOriginSelect = () => {
        destinationInputRef.current?.focus();
    };

    const handleDestinationSelect = async (origin: ILocation | null, destination: ILocation | null) => {
        await calculateRoute(origin, destination);
    };

    const handleTransportModeChange = async (mode: TransportMode) => {
        setTransportMode(mode);
    };

    useEffect(() => {
        if (origin && destination) {
            calculateRoute(origin, destination);
        }
    }, [transportMode]);

    return (
        <div className="max-w-screen-lg mx-auto px-4 py-8 space-y-24">
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">
                    Drive Distance Calculator
                </h1>

                <form className="space-y-6" onSubmit={async (e) => {
                    e.preventDefault();
                    await calculateRoute(origin, destination);
                }}>
                    <TransportModeSelector
                        value={transportMode}
                        onChange={handleTransportModeChange}
                    />

                    <div className="flex flex-col lg:flex-row gap-6">
                        <LocationSelector
                            label="Origin"
                            value={origin}
                            onChange={setOrigin}
                            onSelect={handleOriginSelect}
                        />

                        <div className="border-b lg:border-b-0 lg:border-r border-gray-200 -my-3 lg:my-0"/>

                        <LocationSelector
                            label="Destination"
                            value={destination}
                            onChange={setDestination}
                            onSelect={(value) => handleDestinationSelect(origin, value)}
                            inputRef={destinationInputRef}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg text-gray-900 font-semibold">
                                Results
                            </h2>
                            <button
                                type="submit"
                                disabled={!origin || !destination || loading}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                            >
                                Calculate
                            </button>
                        </div>

                        {
                            origin && destination && (
                                <div>
                                    {
                                        loading
                                            ? <LoadingResult service={'Here'}/>
                                            : error
                                                ? <ErrorResult error={error}/>
                                                : !result
                                                    ? <div className="text-gray-600">
                                                        Waiting for input...
                                                    </div>
                                                    : <div className={'w-full flex flex-col gap-4'}>
                                                        <ResultSection
                                                            title="HERE"
                                                            distance={result?.distance}
                                                            duration={`${result?.duration} minute(s)`}
                                                            bgColor="bg-green-50"
                                                        />
                                                        {
                                                            result?.coordinates && (
                                                                <HERERouteDisplayByCoordinates
                                                                    key={JSON.stringify(result) + transportMode}
                                                                    transportMode={transportMode}
                                                                    coordinates={result.coordinates}
                                                                />
                                                            )
                                                        }
                                                    </div>
                                    }
                                </div>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriveDistancePage;
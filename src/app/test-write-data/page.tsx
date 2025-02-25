"use client";

import React, {useState, ChangeEvent, useEffect} from 'react';

import {CustomSelect, NumberInput, RefreshButton} from "@/components/test-read-write-data";
import Loading from "@/app/loading";
import {ILeadSource} from "@/types";

interface FormData {
    first_name: string;
    last_name: string;
    source: string;
    move_date: string;
    crew_rate: number;
    labor_hours: number;
    total_labor: number;
    travel_rate: number;
    travel_hours: number;
    total_travel: number;
    estimated: number;
}

type IOrderTimes = {
    order: {
        title: string,
        value: number
    },
    leadSource: {
        title: string,
        value: number
    },
    updating: {
        title: string,
        value: number
    },
    full: {
        title: string,
        value: number
    },
}

const TestWriteData: React.FC = () => {
    const [leadSources, setLeadSources] = useState<ILeadSource[]>([]);
    const [order, setOrder] = useState<FormData | null>(null);
    const [times, setTimes] = useState<IOrderTimes>({
        order: {
            title: 'Order',
            value: 0
        },
        leadSource: {
            title: 'Lead Sources',
            value: 0
        },
        updating: {
            title: 'Updating',
            value: 0
        },
        full: {
            title: 'All',
            value: 0
        },
    })

    const fetchOrder = async () => {
        try {
            const start = Date.now();
            const response = await fetch('/api/lead-source?order=true', {
                method: 'GET'
            });
            const data = await response.json();
            const end = Date.now();
            setTimes((prev) => ({
                ...prev,
                order: {
                    ...prev.order,
                    value: end - start
                }
            }))
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };
    const fetchLeadSources = async () => {
        try {
            const start = Date.now();
            const response = await fetch('/api/lead-source', {
                method: 'GET'
            });
            const data = await response.json();
            const end = Date.now();
            setTimes((prev) => ({
                ...prev,
                leadSource: {
                    ...prev.leadSource,
                    value: end - start
                }
            }))
            setLeadSources(data);
        } catch (error) {
            console.error('Error fetching lead sources:', error);
        }
    };
    useEffect(() => {
        fetchLeadSources();
        fetchOrder();
    }, []);

    useEffect(() => {
        if (order) {
            const crewRate = order.crew_rate || 0;
            const laborHours = order.labor_hours || 0;
            const travelRate = order.travel_rate || 0;
            const travelHours = order.travel_hours || 0;

            const totalLabor = Number((crewRate * laborHours).toFixed(2));
            const totalTravel = Number((travelRate * travelHours).toFixed(2));
            const total = Number((totalLabor + totalTravel).toFixed(2));

            setOrder(prev => ({
                ...prev!,
                total_labor: totalLabor,
                total_travel: totalTravel,
                estimated: total
            }));
        }
    }, [order?.crew_rate, order?.labor_hours, order?.travel_rate, order?.travel_hours]);

    const handleTextChange = (field: keyof FormData, value: string): void => {
        setOrder(prev => ({
            ...prev!,
            [field]: value
        }));
    };

    const handleNumberChange = (field: keyof FormData, value: number): void => {
        setOrder(prev => ({
            ...prev!,
            [field]: value
        }));
    };

    const handleBlur = async (source?: string): Promise<void> => {
        try {
            const start = Date.now();
            const newData = {
                first_name: order?.first_name,
                last_name: order?.last_name,
                source: source || order?.source,
                move_date: order?.move_date,
                crew_rate: order?.crew_rate || 0,
                labor_hours: order?.labor_hours || 0,
                total_labor: order?.total_labor || 0,
                travel_rate: order?.travel_rate || 0,
                travel_hours: order?.travel_hours || 0,
                total_travel: order?.total_travel || 0,
                estimated: order?.estimated || 0,
            };
            console.log('new source: ', newData?.source)
            const response = await fetch('/api/lead-source', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });

            const data = await response.json();
            const end = Date.now();
            if (!response.ok) {
                throw new Error('Error updating order');
                return;
            }
            setTimes((prev) => ({
                ...prev,
                updating: {
                    ...prev?.updating,
                    value: end- start
                }
            }))
            setOrder(() => ({
                ...data?.item
            }))

        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const calculateFullTime = () => {
            setTimes((prev) => ({
                ...prev,
                full: {
                    ...prev.full,
                    value: (times.leadSource.value + times.order.value + times.updating.value)
                }
            }))
        }
        calculateFullTime();
    }, [times.leadSource, times.order, times.updating]);

    if (!order) {
        return <Loading/>;
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 bg-white rounded-lg shadow p-6">
            <div className="mb-6 w-full">
                <div className={'flex flex-row justify-between gap-4 items-center'}>
                    <h2 className="text-xl font-bold">Data Edit Form</h2>
                    <RefreshButton fetch={fetchOrder}/>
                </div>
                <ul className={'mt-1 flex flex-col gap-1 items-start text-gray-700 text-sm pl-4 w-full max-w-xs'}>
                    {
                        Object.entries(times)?.map(([key, data]) => (
                            <li className={'list-disc w-full'} key={key}>
                                <div className={'flex w-full items-center gap-4 justify-between'}>
                                    <p>
                                        {data?.title} data received
                                    </p>
                                    <strong>{data?.value}ms</strong>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="space-y-4">
                <div className={'flex flex-col sm:flex-row gap-4 w-full'}>
                    {/* First Name */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={order.first_name as string}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('first_name', e.target.value)}
                            onBlur={() => handleBlur()}
                            placeholder="Enter first name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={order.last_name as string}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('last_name', e.target.value)}
                            onBlur={() => handleBlur()}
                            placeholder="Enter last name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className={'flex w-full flex-col gap-4 sm:flex-row'}>
                    {/* Lead Source */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Lead Source
                        </label>
                        <div className={'grid grid-cols-[1fr_38px] gap-4 w-full items-center'}>
                            <CustomSelect
                                options={leadSources}
                                value={order.source as string || leadSources[0]?.name}
                                onChange={(value) => {
                                    handleTextChange('source', value);
                                    handleBlur(value);
                                }}
                            />
                            <RefreshButton fetch={fetchLeadSources} text={'Refresh lead sources data'}/>
                        </div>
                    </div>

                    {/* Move Date */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Move Date
                        </label>
                        <input
                            type="date"
                            value={order.move_date as string}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('move_date', e.target.value)}
                            onBlur={() => handleBlur()}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className={'flex w-full flex-col gap-4 sm:flex-row'}>
                    {/* Crew Rate */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Crew Rate
                        </label>
                        <NumberInput
                            value={order?.crew_rate || 0}
                            onChange={(value) => handleNumberChange('crew_rate', value)}
                            onBlur={handleBlur}
                            placeholder="0.00"
                            decimals={2}
                            step={0.5}
                        />
                    </div>

                    {/* Labor Hours */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Labor Hours
                        </label>
                        <NumberInput
                            value={order?.labor_hours || 0}
                            onChange={(value) => handleNumberChange('labor_hours', value)}
                            onBlur={handleBlur}
                            placeholder="0.0"
                            decimals={1}
                            step={0.5}
                        />
                    </div>
                </div>

                {/* Total Crew */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Total Labor
                    </label>
                    <input
                        type="text"
                        value={order.total_labor?.toFixed(2) || 0}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                    />
                </div>

                <div className={'flex w-full flex-col gap-4 sm:flex-row'}>
                    {/* Travel Rate */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Travel Rate
                        </label>
                        <NumberInput
                            value={order?.travel_rate || 0}
                            onChange={(value) => handleNumberChange('travel_rate', value)}
                            onBlur={handleBlur}
                            placeholder="0.00"
                            decimals={2}
                            step={0.5}
                        />
                    </div>

                    {/* Travel Hours */}
                    <div className="space-y-2 w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Travel Hours
                        </label>
                        <NumberInput
                            value={order?.travel_hours || 0}
                            onChange={(value) => handleNumberChange('travel_hours', value)}
                            onBlur={handleBlur}
                            placeholder="0.0"
                            decimals={1}
                            step={0.5}
                        />
                    </div>
                </div>
                {/* Total Travel */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Total Travel
                    </label>
                    <input
                        type="text"
                        value={order.total_travel?.toFixed(2) || 0}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700"
                    />
                </div>

                {/* Total */}
                <div className="space-y-2">
                    <label className="block text-sm text-gray-700 font-bold">
                        Total
                    </label>
                    <input
                        type="text"
                        value={order.estimated?.toFixed(2) || 0}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-bold"
                    />
                </div>
            </div>
        </div>
    );
};

export default TestWriteData;
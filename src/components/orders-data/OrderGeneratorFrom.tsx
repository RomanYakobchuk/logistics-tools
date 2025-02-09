'use client';

import React, {useState} from 'react';
import {Download, Loader2, SquarePen} from 'lucide-react';

import {InterfacePreview, OrderPreview} from "@/components/orders-data";
import {IOrder} from "@/types";
import {json2csv} from "json-2-csv";
import {
    DistributionSettings,
    MoveTypeDistribution,
    StatusDistribution
} from "@/components/orders-data/DistributionSettings";

const AVAILABLE_STATES = [
    {value: 'ALL', label: 'All States (Random)'},
    {value: 'AL', label: 'Alabama'},
    {value: 'AK', label: 'Alaska'},
    {value: 'AZ', label: 'Arizona'},
    {value: 'AR', label: 'Arkansas'},
    {value: 'CA', label: 'California'},
    {value: 'CO', label: 'Colorado'},
    {value: 'CT', label: 'Connecticut'},
    {value: 'DE', label: 'Delaware'},
    {value: 'FL', label: 'Florida'},
    {value: 'GA', label: 'Georgia'},
    {value: 'HI', label: 'Hawaii'},
    {value: 'ID', label: 'Idaho'},
    {value: 'IL', label: 'Illinois'},
    {value: 'IN', label: 'Indiana'},
    {value: 'IA', label: 'Iowa'},
    {value: 'KS', label: 'Kansas'},
    {value: 'KY', label: 'Kentucky'},
    {value: 'LA', label: 'Louisiana'},
    {value: 'ME', label: 'Maine'},
    {value: 'MD', label: 'Maryland'},
    {value: 'MA', label: 'Massachusetts'},
    {value: 'MI', label: 'Michigan'},
    {value: 'MN', label: 'Minnesota'},
    {value: 'MS', label: 'Mississippi'},
    {value: 'MO', label: 'Missouri'},
    {value: 'MT', label: 'Montana'},
    {value: 'NE', label: 'Nebraska'},
    {value: 'NV', label: 'Nevada'},
    {value: 'NH', label: 'New Hampshire'},
    {value: 'NJ', label: 'New Jersey'},
    {value: 'NM', label: 'New Mexico'},
    {value: 'NY', label: 'New York'},
    {value: 'NC', label: 'North Carolina'},
    {value: 'ND', label: 'North Dakota'},
    {value: 'OH', label: 'Ohio'},
    {value: 'OK', label: 'Oklahoma'},
    {value: 'OR', label: 'Oregon'},
    {value: 'PA', label: 'Pennsylvania'},
    {value: 'RI', label: 'Rhode Island'},
    {value: 'SC', label: 'South Carolina'},
    {value: 'SD', label: 'South Dakota'},
    {value: 'TN', label: 'Tennessee'},
    {value: 'TX', label: 'Texas'},
    {value: 'UT', label: 'Utah'},
    {value: 'VT', label: 'Vermont'},
    {value: 'VA', label: 'Virginia'},
    {value: 'WA', label: 'Washington'},
    {value: 'WV', label: 'West Virginia'},
    {value: 'WI', label: 'Wisconsin'},
    {value: 'WY', label: 'Wyoming'}
];

const options = {
    keys: [
        'first_name',
        'last_name',
        'email',
        'phone',
        'move_size',
        'move_type',
        'source',
        'status',
        'follow_up',
        'volume',
        'crew_size',
        'trucks',
        'created_at',
        'move_date',
        'follow_up_date',
        'booked_date',
        'pickup_zip',
        'pickup_city',
        'pickup_state',
        'delivery_zip',
        'delivery_city',
        'delivery_state',
        'estimated',
        'balance'
    ],
    emptyFieldValue: '',
    delimiter: {
        field: ',',
    }
};

const OrderGeneratorForm = () => {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [pickupState, setPickupState] = useState('ALL');
    const [count, setCount] = useState('1000');
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [moveTypeDistribution, setMoveTypeDistribution] = useState<MoveTypeDistribution>();
    const [statusDistribution, setStatusDistribution] = useState<StatusDistribution>();
    const [message, setMessage] = useState('');

    const handleDistributionChange = (
        moveType: MoveTypeDistribution,
        status: StatusDistribution
    ) => {
        setMoveTypeDistribution(moveType);
        setStatusDistribution(status);
    };

    const handleGenerate = async () => {
        try {
            setMessage('');
            setIsLoading(true);
            const startTime = performance.now();

            const params = new URLSearchParams();

            params.set('count', count);
            if (pickupState !== 'ALL') {
                params.set('pickupState', pickupState);
            }

            if (moveTypeDistribution) {
                params.set('moveType', JSON.stringify(moveTypeDistribution));
            }
            if (statusDistribution) {
                params.set('status', JSON.stringify(statusDistribution));
            }

            const response = await fetch(`/api/generate-orders?${params}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate orders');
            }

            const data: IOrder[] = await response.json();
            const endTime = performance.now();
            const executionTime = ((endTime - startTime) / 1000).toFixed(2);

            setOrders(data);
            setMessage(`Generated ${data.length.toLocaleString()} orders in ${executionTime} seconds`);
        } catch (error) {
            console.error('Error generating orders:', error);
            alert(error instanceof Error ? error.message : 'Failed to generate orders. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (format: 'csv' | 'json') => {
        try {
            let blob;
            if (format === 'csv') {
                const csv = await json2csv(orders, options);
                blob = new Blob([csv], {type: 'text/csv'});
            } else {
                blob = new Blob([JSON.stringify(orders, null, 2)], {type: 'application/json'});
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orders-${count}-${new Date().toISOString()}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="min-h-[70vh] py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Generate Test Orders</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Generate sample moving orders with random customer data and addresses
                        </p>
                    </div>

                    <div className="w-full">
                        <DistributionSettings onDistributionChange={handleDistributionChange}/>
                        <p className="text-xs text-gray-500 px-1 -mt-3">
                            Change Move Type and Status percentage distribution or use default values for random
                            generation
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Pickup State
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-left text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                                >
                                    {AVAILABLE_STATES.find(state => state.value === pickupState)?.label}
                                </button>

                                {isSelectOpen && (
                                    <div
                                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
                                        <div className="p-2 border-b border-gray-200">
                                            <input
                                                type="text"
                                                placeholder="Search states..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-auto">
                                            {AVAILABLE_STATES.filter(state =>
                                                state.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                state.value.toLowerCase().includes(searchQuery.toLowerCase())
                                            ).map((state) => (
                                                <button
                                                    key={state.value}
                                                    className="w-full px-4 py-2.5 text-left hover:bg-blue-50 text-gray-900 focus:outline-none focus:bg-blue-50"
                                                    onClick={() => {
                                                        setPickupState(state.value);
                                                        setIsSelectOpen(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    {state.label}
                                                    {state.value !== 'ALL' && (
                                                        <span className="ml-2 text-gray-400 text-sm">
                                                            ({state.value})
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Select &apos;All States&apos; for random pickup locations or choose a specific state
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Orders
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="20000"
                                value={count}
                                onChange={(e) => {
                                    const v = Number(e.target.value || 0);
                                    setCount((v < 0 ? 0 : v >= 20000 ? 20000 : v)?.toString())
                                }}
                                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Generate between 1 and 20,000 orders
                            </p>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-medium transition-colors
                                ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <SquarePen className="mr-2 h-5 w-5"/>
                                    <span>Generate orders</span>
                                </>
                            )}
                        </button>
                    </div>
                    {orders?.length > 0 && message && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div className="space-y-1">
                                <p className="text-gray-800 font-medium">
                                    Successfully generated {orders.length.toLocaleString()} orders
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date().toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </p>
                            </div>
                        </div>
                    )}

                    {orders?.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => handleDownload('csv')}
                                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                                >
                                    <Download className="mr-2 h-5 w-5"/> Download CSV
                                </button>
                                <button
                                    onClick={() => handleDownload('json')}
                                    className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center"
                                >
                                    <Download className="mr-2 h-5 w-5"/> Download JSON
                                </button>
                            </div>
                            <OrderPreview orders={orders?.slice(0, 100)}/>
                        </div>
                    )}
                    <InterfacePreview orders={orders}/>
                </div>
            </div>
        </div>
    );
};

export default OrderGeneratorForm;
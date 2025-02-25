import React from 'react';
import {IOrder} from "@/types";

interface GeneratedStats {
    moveTypes: { [key: string]: number };
    statuses: { [key: string]: number };
    totalOrders: number;
}

const InterfacePreview = ({ orders = [] }: { orders?: IOrder[] }) => {
    const stats: GeneratedStats = orders.reduce((acc, order) => {
        acc.moveTypes[order.move_type] = (acc.moveTypes[order.move_type] || 0) + 1;
        acc.statuses[order.status] = (acc.statuses[order.status] || 0) + 1;
        acc.totalOrders += 1;
        return acc;
    }, {
        moveTypes: {},
        statuses: {},
        totalOrders: 0
    } as GeneratedStats);

    const calculatePercentage = (count: number, total: number): string => {
        return `${((count / total) * 100).toFixed(1)}%`;
    };

    return (
        <div className="mt-8 space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Generated Data Structure</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Overview of the data types and fields that will be generated
                </p>
            </div>

            {stats.totalOrders > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="font-medium text-gray-900 mb-3">Generated Move Types Distribution</div>
                            <div className="space-y-1.5 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(stats.moveTypes).map(([type, count]) => (
                                        <React.Fragment key={type}>
                                            <div className="text-gray-600">{type}:</div>
                                            <div className="font-mono text-gray-900">
                                                {count} ({calculatePercentage(count, stats.totalOrders)})
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="font-medium text-gray-900 mb-3">Generated Status Distribution</div>
                            <div className="space-y-1.5 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(stats.statuses).map(([status, count]) => (
                                        <React.Fragment key={status}>
                                            <div className="text-gray-600">{status}:</div>
                                            <div className="font-mono text-gray-900">
                                                {count} ({calculatePercentage(count, stats.totalOrders)})
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 my-8"></div>
                </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Order Data</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">order_number:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">first_name:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">last_name:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">email:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">phone:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">pickup_zip:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">pickup_city:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">pickup_state:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">delivery_zip:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">delivery_city:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">delivery_state:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">move_type:</div>
                            <div className="font-mono text-gray-900">MoveType</div>
                            <div className="text-gray-600">move_size:</div>
                            <div className="font-mono text-gray-900">MoveSize</div>
                            <div className="text-gray-600">status:</div>
                            <div className="font-mono text-gray-900">Status</div>
                            <div className="text-gray-600">follow_up:</div>
                            <div className="font-mono text-gray-900">FollowUp?</div>
                            <div className="text-gray-600">source:</div>
                            <div className="font-mono text-gray-900">Source</div>
                            <div className="text-gray-600">volume:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">crew_size:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">trucks:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">created_at:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">move_date:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">follow_up_date:</div>
                            <div className="font-mono text-gray-900">string?</div>
                            <div className="text-gray-600">booked_date:</div>
                            <div className="font-mono text-gray-900">string?</div>
                            <div className="text-gray-600">estimated:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">balance:</div>
                            <div className="font-mono text-gray-900">number</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Status Values</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">Booked:</div>
                            <div className="font-mono text-gray-900">40%</div>
                            <div className="text-gray-600">Dead:</div>
                            <div className="font-mono text-gray-900">20%</div>
                            <div className="text-gray-600">Follow Up:</div>
                            <div className="font-mono text-gray-900">30%</div>
                            <div className="text-gray-600">New:</div>
                            <div className="font-mono text-gray-900">10%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Move Type Values</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">Commercial Move:</div>
                            <div className="font-mono text-gray-900">5%</div>
                            <div className="text-gray-600">Intrastate Move:</div>
                            <div className="font-mono text-gray-900">5%</div>
                            <div className="text-gray-600">Junk Removal:</div>
                            <div className="font-mono text-gray-900">5%</div>
                            <div className="text-gray-600">Labor Only:</div>
                            <div className="font-mono text-gray-900">5%</div>
                            <div className="text-gray-600">Local Move:</div>
                            <div className="font-mono text-gray-900">40%</div>
                            <div className="text-gray-600">Long Distance Move:</div>
                            <div className="font-mono text-gray-900">40%</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Sources</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="font-mono text-gray-900">Angi</div>
                            <div className="font-mono text-gray-900">Direct Mail</div>
                            <div className="font-mono text-gray-900">Google Ads</div>
                            <div className="font-mono text-gray-900">Google (Organic)</div>
                            <div className="font-mono text-gray-900">Home Advisor</div>
                            <div className="font-mono text-gray-900">Saw Our Truck</div>
                            <div className="font-mono text-gray-900">Thumbtack</div>
                            <div className="font-mono text-gray-900">Yahoo</div>
                            <div className="font-mono text-gray-900">Yelp</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Move Size Values</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-1 gap-1">
                            <div className="font-mono text-gray-900">1 Bedroom Apartment</div>
                            <div className="font-mono text-gray-900">1 Bedroom House</div>
                            <div className="font-mono text-gray-900">2 Bedroom Apartment</div>
                            <div className="font-mono text-gray-900">2 Bedroom House</div>
                            <div className="font-mono text-gray-900">3 Bedroom Apartment</div>
                            <div className="font-mono text-gray-900">3 Bedroom House</div>
                            <div className="font-mono text-gray-900">4+ Bedroom Apartment</div>
                            <div className="font-mono text-gray-900">4+ Bedroom House</div>
                            <div className="font-mono text-gray-900">Few Items</div>
                            <div className="font-mono text-gray-900">Studio</div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Volume Ranges</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">1 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">300-500</div>
                            <div className="text-gray-600">1 Bedroom House:</div>
                            <div className="font-mono text-gray-900">400-700</div>
                            <div className="text-gray-600">2 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">500-1000</div>
                            <div className="text-gray-600">2 Bedroom House:</div>
                            <div className="font-mono text-gray-900">600-1200</div>
                            <div className="text-gray-600">3 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">700-1500</div>
                            <div className="text-gray-600">3 Bedroom House:</div>
                            <div className="font-mono text-gray-900">800-1600</div>
                            <div className="text-gray-600">4+ Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">900-2000</div>
                            <div className="text-gray-600">4+ Bedroom House:</div>
                            <div className="font-mono text-gray-900">1000-2400</div>
                            <div className="text-gray-600">Few Items:</div>
                            <div className="font-mono text-gray-900">200-800</div>
                            <div className="text-gray-600">Studio:</div>
                            <div className="font-mono text-gray-900">400-800</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Crew Size Ranges</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">1 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">2-5</div>
                            <div className="text-gray-600">1 Bedroom House:</div>
                            <div className="font-mono text-gray-900">2-5</div>
                            <div className="text-gray-600">2 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">2-6</div>
                            <div className="text-gray-600">2 Bedroom House:</div>
                            <div className="font-mono text-gray-900">2-6</div>
                            <div className="text-gray-600">3 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">2-8</div>
                            <div className="text-gray-600">3 Bedroom House:</div>
                            <div className="font-mono text-gray-900">2-8</div>
                            <div className="text-gray-600">4+ Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">3-12</div>
                            <div className="text-gray-600">4+ Bedroom House:</div>
                            <div className="font-mono text-gray-900">3-12</div>
                            <div className="text-gray-600">Few Items:</div>
                            <div className="font-mono text-gray-900">2-4</div>
                            <div className="text-gray-600">Studio:</div>
                            <div className="font-mono text-gray-900">2-6</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Estimated Cost Ranges</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">1 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">1,000-7,000</div>
                            <div className="text-gray-600">1 Bedroom House:</div>
                            <div className="font-mono text-gray-900">1,200-7,500</div>
                            <div className="text-gray-600">2 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">1,500-8,000</div>
                            <div className="text-gray-600">2 Bedroom House:</div>
                            <div className="font-mono text-gray-900">1,700-8,500</div>
                            <div className="text-gray-600">3 Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">1,800-9,000</div>
                            <div className="text-gray-600">3 Bedroom House:</div>
                            <div className="font-mono text-gray-900">1,900-9,500</div>
                            <div className="text-gray-600">4+ Bedroom Apartment:</div>
                            <div className="font-mono text-gray-900">2,000-10,000</div>
                            <div className="text-gray-600">4+ Bedroom House:</div>
                            <div className="font-mono text-gray-900">2,500-12,000</div>
                            <div className="text-gray-600">Few Items:</div>
                            <div className="font-mono text-gray-900">700-2,000</div>
                            <div className="text-gray-600">Studio:</div>
                            <div className="font-mono text-gray-900">1,100-7,200</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Trucks Required</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">1-3 Bedroom:</div>
                            <div className="font-mono text-gray-900">1</div>
                            <div className="text-gray-600">4+ Bedroom:</div>
                            <div className="font-mono text-gray-900">2</div>
                            <div className="text-gray-600">Few Items:</div>
                            <div className="font-mono text-gray-900">1</div>
                            <div className="text-gray-600">Studio:</div>
                            <div className="font-mono text-gray-900">1</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Balance Calculation</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">Booked:</div>
                            <div className="font-mono text-gray-900">0-85%</div>
                            <div className="text-gray-600">Follow Up:</div>
                            <div className="font-mono text-gray-900">85-100%</div>
                            <div className="text-gray-600">Other:</div>
                            <div className="font-mono text-gray-900">100%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfacePreview;
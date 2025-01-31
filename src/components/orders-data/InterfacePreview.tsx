import React from 'react';

const InterfacePreview = () => {
    return (
        <div className="mt-8 space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Generated Data Structure</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Overview of the data types and fields that will be generated
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Order Data (IOrder)</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">customer:</div>
                            <div className="font-mono text-gray-900">ICustomer</div>
                            <div className="text-gray-600">pickup_address:</div>
                            <div className="font-mono text-gray-900">IAddress</div>
                            <div className="text-gray-600">delivery_address:</div>
                            <div className="font-mono text-gray-900">IAddress</div>
                            <div className="text-gray-600">move_type:</div>
                            <div className="font-mono text-gray-900">IMoveType</div>
                            <div className="text-gray-600">move_size:</div>
                            <div className="font-mono text-gray-900">string</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Customer Data (ICustomer)</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">first_name:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">last_name:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">email:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">phone:</div>
                            <div className="font-mono text-gray-900">string</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Address Data (IAddress)</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">address:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">zip_code:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">city:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">state:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">country:</div>
                            <div className="font-mono text-gray-900">string</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Move Type Data (IMoveType)</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">local_move:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">long_distance_move:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">intrastate_move:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">commercial_move:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">junk_removal:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">labor_only:</div>
                            <div className="font-mono text-gray-900">number</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterfacePreview;
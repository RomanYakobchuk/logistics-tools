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
                    <div className="font-medium text-gray-900 mb-3">Order Data</div>
                    <div className="space-y-1.5 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">customer:</div>
                            <div className="font-mono text-gray-900">ICustomer</div>
                            <div className="text-gray-600">pickup_address:</div>
                            <div className="font-mono text-gray-900">IAddress</div>
                            <div className="text-gray-600">delivery_address:</div>
                            <div className="font-mono text-gray-900">IAddress</div>
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
                            <div className="text-gray-600">estimated:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">balance:</div>
                            <div className="font-mono text-gray-900">number</div>
                            <div className="text-gray-600">created_at:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">move_date:</div>
                            <div className="font-mono text-gray-900">string</div>
                            <div className="text-gray-600">follow_up_date:</div>
                            <div className="font-mono text-gray-900">string?</div>
                            <div className="text-gray-600">booked_date:</div>
                            <div className="font-mono text-gray-900">string?</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="font-medium text-gray-900 mb-3">Customer Data</div>
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
                    <div className="font-medium text-gray-900 mb-3">Address Data</div>
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
            </div>
        </div>
    );
};

export default InterfacePreview;
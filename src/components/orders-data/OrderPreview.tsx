'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Phone } from 'lucide-react';
import { IOrder } from "@/types";

interface OrderPreviewProps {
    orders: IOrder[];
}

export const OrderPreview: React.FC<OrderPreviewProps> = ({ orders }) => {
    const [showPreview, setShowPreview] = useState(false);

    if (orders.length === 0) return null;

    return (
        <div className="border rounded-lg overflow-hidden">
            <div
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => setShowPreview(!showPreview)}
            >
                <h3 className="text-lg font-medium text-gray-900">
                    Preview (First {Math.min(orders.length, 20)} Orders)
                </h3>
                {showPreview ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </div>

            {showPreview && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 transition-all">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pickup
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delivery
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Move Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Move Size
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 20).map((order, index) => (
                            <tr key={JSON.stringify(order.customer)} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.customer.first_name} {order.customer.last_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-y-2">
                                    <div className="text-sm text-gray-500 text-nowrap flex items-center gap-2">
                                        <Mail className="h-5 w-5"/>
                                        {order.customer.email}
                                    </div>
                                    <div className="text-sm text-gray-500 text-nowrap flex items-center gap-2">
                                        <Phone className="h-5 w-5"/>
                                        {order.customer.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 flex-shrink-0"/>
                                        <div>
                                            <div className="text-sm text-gray-900">
                                                {order.pickup_address.address}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.pickup_address.city}, {order.pickup_address.state}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.pickup_address.zip_code}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-5 w-5 flex-shrink-0"/>
                                        <div>
                                            <div className="text-sm text-gray-900">
                                                {order.delivery_address.address}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.delivery_address.city}, {order.delivery_address.state}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.delivery_address.zip_code}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 capitalize">
                                        {order.move_type.replace('_', ' ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.move_size}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderPreview;
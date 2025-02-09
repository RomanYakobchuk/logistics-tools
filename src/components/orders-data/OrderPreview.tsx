'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Phone, Calendar, DollarSign, Users, Truck } from 'lucide-react';
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
                    Preview (First {Math.min(orders.length, 100)} Orders)
                </h3>
                {showPreview ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
            </div>

            {showPreview && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
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
                                Move Info
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Details
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {orders.slice(0, 100).map((order, index) => (
                            <tr key={JSON.stringify(order.first_name + order.last_name + order.phone + order.email)} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.first_name} {order.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Source: {order.source}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap space-y-2">
                                    <div className="text-sm text-gray-500 text-nowrap flex items-center gap-2">
                                        <Mail className="h-4 w-4"/>
                                        {order.email}
                                    </div>
                                    <div className="text-sm text-gray-500 text-nowrap flex items-center gap-2">
                                        <Phone className="h-4 w-4"/>
                                        {order.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 flex-shrink-0"/>
                                        <div>
                                            <div className="text-sm text-gray-500">
                                                {order.pickup_city}, {order.pickup_state}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.pickup_zip}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 flex-shrink-0"/>
                                        <div>
                                            <div className="text-sm text-gray-500">
                                                {order.delivery_city}, {order.delivery_state}
                                            </div>
                                            <div className="text-sm text-gray-500">{order.delivery_zip}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm">
                                        <div className="text-gray-900">Type: {order.move_type.replace(/_/g, ' ')}</div>
                                        <div className="text-gray-500 mt-1">Size: {order.move_size}</div>
                                        <div className="text-gray-500 mt-1">Volume: {order.volume}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium">
                                            <span className={`px-2 py-1 rounded-full ${
                                                order.status === 'Booked' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Dead' ? 'bg-red-100 text-red-800' :
                                                        order.status === 'Follow Up' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                    </div>
                                    {order.status === 'Follow Up' && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            {order.follow_up}
                                        </div>
                                    )}
                                    {order.follow_up_date && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Follow up: {order.follow_up_date}
                                        </div>
                                    )}
                                    {order.booked_date && (
                                        <div className="text-sm text-gray-500 mt-1">
                                            Booked: {order.booked_date}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>Created: {order.created_at}</span>
                                                <span>Move: {order.move_date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>Est: ${order.estimated.toLocaleString()}</span>
                                                <span>Balance: ${order.balance.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            <span>Crew: {order.crew_size}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4" />
                                            <span>Trucks: {order.trucks}</span>
                                        </div>
                                    </div>
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
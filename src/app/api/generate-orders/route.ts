import { NextRequest, NextResponse } from 'next/server';
import { generateOrders } from '@/lib/order-generator';
import {json2csv} from 'json-2-csv';

export const maxDuration = 59;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { count, pickupState } = await req.json();

        const orderCount = Math.min(Math.max(1, Number(count)), 200000);

        const orders = generateOrders(orderCount, pickupState);

        const options = {
            keys: [
                'customer.first_name',
                'customer.last_name',
                'customer.email',
                'customer.phone',
                'pickup_address.address',
                'pickup_address.zip_code',
                'pickup_address.city',
                'pickup_address.state',
                'pickup_address.country',
                'delivery_address.address',
                'delivery_address.zip_code',
                'delivery_address.city',
                'delivery_address.state',
                'delivery_address.country',
                'move_type.local_move',
                'move_type.long_distance_move',
                'move_type.intrastate_move',
                'move_type.commercial_move',
                'move_type.junk_removal',
                'move_type.labor_only',
                'move_size',
            ],
            emptyFieldValue: '',
            delimiter: {
                field: ',',
            }
        };

        const csv = await json2csv(orders, options);

        return NextResponse.json({
            csvBlob: csv,
            previewData: orders.slice(0, 20)
        });
    } catch (error) {
        console.error('Error generating orders:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate orders',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { generateOrders } from '@/lib/order-generator';
import { json2csv } from 'json-2-csv';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { count, pickupState } = await req.json();
        const orderCount = Math.min(Math.max(1, Number(count)), 100000);
        const orders = generateOrders(orderCount, pickupState);

        const options = {
            keys: [
                'customer.first_name',
                'customer.last_name',
                'customer.email',
                'customer.phone',
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
                'estimated',
                'balance'
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
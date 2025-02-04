import { NextRequest, NextResponse } from 'next/server';
import { generateOrders } from '@/lib/order-generator';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const count = searchParams.get('count');
        const pickupState = searchParams.get('pickupState');

        const orderCount = Math.min(Math.max(1, Number(count) || 10), 100000); // За замовчуванням 10 замовлень
        const orders = generateOrders(orderCount, pickupState || undefined);

        return NextResponse.json(orders);
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

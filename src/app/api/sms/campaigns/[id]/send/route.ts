import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const {id: campaignId} = await params;
        const data = await request.json();
        const { to, from, message, service } = data;

        if (!to || !from || !message || !service) {
            return NextResponse.json(
                { error: 'Missing required fields: to, from, message, or service' },
                { status: 400 }
            );
        }

        // Отримати токен з хедера для авторизації
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Відправити запит до зовнішнього API
        const response = await fetch(`${process.env.API_BASE_URL}/sms/campaigns/${campaignId}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                to,
                from,
                message,
                service,
            }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.message || 'Failed to send SMS' },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error sending SMS:', error);
        return NextResponse.json(
            { error: 'Server error' },
            { status: 500 }
        );
    }
}
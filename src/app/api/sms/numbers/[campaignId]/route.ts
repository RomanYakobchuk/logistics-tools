import { NextRequest, NextResponse } from 'next/server';

const API = 'https://api.krewsapp.com';
// process.env.API_BASE_URL ||

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {campaignId} = await params;

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('service');

    try {
        let externalApiUrl = `${API}/sms/numbers/${encodeURIComponent(campaignId)}`;
        if (serviceId) {
            externalApiUrl += `?service=${encodeURIComponent(serviceId)}`;
        }

        const response = await fetch(externalApiUrl, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API error:', errorText);
            throw new Error(`External API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching phone numbers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch phone numbers. Please try again later.' },
            { status: 500 }
        );
    }
}


export async function POST(request: NextRequest, { params }: { params: Promise<{ campaignId: string }> }) {
    const {campaignId} = await params;

    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode') || 'US';

    try {
        const requestData = await request.json();

        const { items, service } = requestData;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { message: 'items must be a non-empty array' },
                { status: 400 }
            );
        }

        /*eslint-disable*/
        const hasStrings = items.some((item: any) => typeof item === 'string');
        const hasObjects = items.some((item: any) => typeof item === 'object');
        /*eslint-enable*/

        if (hasStrings && hasObjects) {
            return NextResponse.json(
                { message: 'items must contain either all strings or all objects, not mixed' },
                { status: 400 }
            );
        }

        if (hasObjects) {
            for (const item of items) {
                if (!item.phone || !item.sid) {
                    return NextResponse.json(
                        { message: 'Each object in items must have phone and sid properties' },
                        { status: 400 }
                    );
                }
            }
        }

        let externalApiUrl = `${API}/sms/numbers/${encodeURIComponent(campaignId)}`;
        if (countryCode && countryCode !== 'US') {
            externalApiUrl += `?countryCode=${encodeURIComponent(countryCode)}`;
        }

        const response = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items,
                service
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API error:', errorText);
            throw new Error(`External API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error purchasing phone numbers:', error);
        return NextResponse.json(
            { error: 'Failed to purchase phone numbers. Please try again later.' },
            { status: 500 }
        );
    }
}
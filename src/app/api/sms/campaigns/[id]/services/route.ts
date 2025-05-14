import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_BASE_URL;

export async function GET(request: NextRequest, {params}: {params: Promise<{id: string}>}) {

    const {id: campaignId} = await params;

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
        let externalApiUrl = `${API}/sms/campaigns/${encodeURIComponent(campaignId)}/services`;
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
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services. Please try again later.' },
            { status: 500 }
        );
    }
}
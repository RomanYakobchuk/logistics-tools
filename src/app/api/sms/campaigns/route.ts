import { NextRequest, NextResponse } from 'next/server';

const API = 'https://api.krewsapp.com';
// process.env.API_BASE_URL ||

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaign');

    try {
        let externalApiUrl = `${API}/sms/campaigns`;
        if (campaignId) {
            externalApiUrl += `?campaign=${encodeURIComponent(campaignId)}`;
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
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns. Please try again later.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }

    try {
        const requestData = await request.json();

        const { companyId, friendlyName, useCase } = requestData;

        if (!companyId || !friendlyName || !useCase) {
            return NextResponse.json(
                { message: 'Company ID, friendly name, and use case are required' },
                { status: 400 }
            );
        }

        const externalApiUrl = `${API}/sms/campaigns`;

        const response = await fetch(externalApiUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                companyId,
                friendlyName,
                useCase
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
        console.error('Error creating campaign:', error);
        return NextResponse.json(
            { error: 'Failed to create campaign. Please try again later.' },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.API_BASE_URL;

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }
    const searchParams = request.nextUrl.searchParams;
    const countryCode = searchParams.get('countryCode') || 'US';
    const areaCode = searchParams.get('areaCode') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    if (!areaCode) {
        return NextResponse.json(
            { error: 'Area code is required' },
            { status: 400 }
        );
    }

    try {
        const externalApiUrl = `${API}/sms/numbers/available`;

        // For GET requests with query parameters
        const url = new URL(externalApiUrl);
        url.searchParams.append('countryCode', countryCode);
        url.searchParams.append('areaCode', areaCode);
        url.searchParams.append('page', page.toString());
        url.searchParams.append('pageSize', pageSize.toString());

        const response = await fetch(url.toString(), {
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
            { error: 'Failed to fetch available phone numbers. Please try again later.' },
            { status: 500 }
        );
    }
}
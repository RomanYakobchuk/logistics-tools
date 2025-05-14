import { NextRequest, NextResponse } from 'next/server';
import { SmsMessagesResponse, GetSmsMessagesParams } from '@/interfaces/messages';

const API = process.env.API_BASE_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
        return NextResponse.json(
            { message: 'Authorization header is required' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const {id: campaignName} = await params;

    const queryParams: GetSmsMessagesParams = {};

    const messageSid = searchParams.get('message');
    if (messageSid) {
        queryParams.message = messageSid;
    }

    const filters = [
        'limit', 'page', 'to', 'from', 'status',
        'dateFrom', 'dateTo'
    ];

    filters.forEach((filter) => {
        const value = searchParams.get(filter);
        if (value && filter) {
            // @ts-expect-error types error
            queryParams[filter as keyof GetSmsMessagesParams] = value;
        }
    });

    try {
        const queryString = new URLSearchParams(
            Object.entries(queryParams) as string[][]
        ).toString();

        const externalApiUrl = `${API}/sms/messages/${encodeURIComponent(campaignName)}${queryString ? `?${queryString}` : ''}`;

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

        const data: SmsMessagesResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching SMS messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch SMS messages. Please try again later.' },
            { status: 500 }
        );
    }
}
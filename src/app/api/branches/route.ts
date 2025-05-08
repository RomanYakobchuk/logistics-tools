import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader) {
            return NextResponse.json(
                { message: 'Authorization header is required' },
                { status: 401 }
            );
        }

        const response = await fetch(`${process.env.API_BASE_URL}/branches`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { message: 'Failed to fetch branches' },
                { status: response.status }
            );
        }

        const responseData = await response.json();

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error('Branches fetch error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
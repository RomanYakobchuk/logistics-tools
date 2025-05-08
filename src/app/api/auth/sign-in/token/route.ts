import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { accessToken, refreshToken, company, branch } = data;

        // Validate input data
        if (!accessToken || !refreshToken || !company) {
            return NextResponse.json(
                { message: 'Access token, refresh token та компанія обов\'язкові' },
                { status: 400 }
            );
        }

        // Forward request to the external API
        const response = await fetch(`${process.env.API_BASE_URL}/sign-in/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accessToken,
                refreshToken,
                company,
                branch: branch || undefined,
            }),
        });

        // Get the response data
        const responseData = await response.json();

        // Return the response with the same status code
        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('Token refresh error:', error);
        return NextResponse.json(
            { message: 'Помилка сервера' },
            { status: 500 }
        );
    }
}
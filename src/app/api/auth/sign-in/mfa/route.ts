import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, code, session, rememberDevice } = data;

        if (!email || !code || !session) {
            return NextResponse.json(
                { message: 'Email, code and session are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_BASE_URL}/sign-in/mfa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                code,
                session,
                rememberDevice: rememberDevice || false,
            }),
        });

        const responseData = await response.json();

        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('MFA verification error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, company, session, rememberDevice } = data;
        const deviceKey = "us-east-1_6bda249c-d845-4b5f-b006-d86b383095ba";

        if (!email || !company || !session) {
            return NextResponse.json(
                { message: 'Email, company and session required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_BASE_URL}/sign-in/company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                company,
                session,
                rememberDevice: rememberDevice || false,
                deviceKey: deviceKey || undefined,
            }),
        });

        const responseData = await response.json();

        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('Company selection error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
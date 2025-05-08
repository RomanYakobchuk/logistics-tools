import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { email, password } = data;
        const deviceKey = "us-east-1_6bda249c-d845-4b5f-b006-d86b383095ba";

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_BASE_URL}/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                deviceKey,
            }),
        });

        const responseData = await response.json();

        return NextResponse.json(responseData, { status: response.status });
    } catch (error) {
        console.error('Sign-in error:', error);
        return NextResponse.json(
            { message: 'Server error' },
            { status: 500 }
        );
    }
}
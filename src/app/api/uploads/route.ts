// app/api/uploads/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This API route acts as a proxy to your AWS Lambda
export async function POST(request: NextRequest) {
    try {
        // Get the JSON data from the client request
        const requestData = await request.json();

        // Forward the request to your Lambda function
        const response = await fetch('http://localhost:3000/dev/uploads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`Lambda API error: ${response.status}`);
        }

        // Get the signed URL from Lambda
        const data = await response.json();

        // Return the data directly to the client
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in upload proxy:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

// Handle CORS if needed
export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
    });
}
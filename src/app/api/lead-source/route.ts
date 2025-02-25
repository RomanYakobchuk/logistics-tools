import {NextResponse} from "next/server";
import {API_LAMBDA} from "@/lib/constant";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const isOrder = searchParams.get('order') === 'true';

    try {
        let url = API_LAMBDA;
        if (isOrder) {
            url += '?order=true';
        }
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json();
        if (response.ok) {
            return NextResponse.json(isOrder ? data?.item : data.items);
        }
    } catch (e) {
        console.log('error: ', e);
        return NextResponse.json([], {
            status: 500
        })
    }
}

export async function PUT(request: Request) {

    try {
        const orderData = await request.json();

        const response = await fetch(API_LAMBDA, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json({error: JSON.stringify(data)}, {status: 500});
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_123', {
    apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: Request) {
    try {
        const { email, waitlistId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            client_reference_id: waitlistId,
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'PinkySwear Bailout Token',
                            description: 'Pre-order token to cover your first $100 mistake when the app launches.',
                        },
                        unit_amount: 500, // $5.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/`,
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

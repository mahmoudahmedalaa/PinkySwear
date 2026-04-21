import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, getDoc, increment } from 'firebase/firestore';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2026-03-25.dahlia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Initialize Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const waitlistId = session.client_reference_id;

    if (email && waitlistId) {
      try {
        // Find the user directly via ID to bypass restrictive Firebase Read rules
        const docRef = doc(db, 'waitlist', waitlistId);

        // Fetch to see if they have a referrer
        const docSnap = await getDoc(docRef);
        const referrerId = docSnap.exists() ? docSnap.data().referrerId : null;

        // Update their status to 'paid'
        await updateDoc(docRef, {
          paymentStatus: 'paid'
        });
        console.log(`Successfully updated Firebase for paid user: ${email} (${waitlistId})`);

        if (referrerId) {
          const referrerRef = doc(db, 'waitlist', referrerId);
          try {
            await updateDoc(referrerRef, {
              referralCount: increment(1)
            });
            console.log(`Incremented referralCount for referrer: ${referrerId}`);
          } catch (e) {
            console.error('Failed to increment referrer:', e);
          }
        }

        // Shoot out the brutal welcome email
        const mailOptions = {
          from: `"PinkySwear" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "You're On The Hook. No Backing Out Now.",
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #fff; padding: 40px; border: 8px solid black; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #FF003C; text-transform: uppercase; font-weight: 900; font-size: 32px; letter-spacing: -1px; margin-top: 0; text-align: center;">
                Bailout Token Secured.
              </h1>
              <div style="background-color: #00FF66; padding: 20px; border: 4px solid black; margin-bottom: 30px;">
                <p style="font-size: 20px; font-weight: bold; margin: 0; color: black;">
                  We got your $5 exactly. You are not allowed to quit now.
                </p>
              </div>
              <p style="font-size: 18px; font-weight: bold; color: #333; line-height: 1.5;">
                You proved you actually have skin in the game. That makes you better than 99% of people who just talk.
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.5;">
                When the PinkySwear app officially drops, we will notify you immediately. Your Bailout token is logged in your account, and it will cover 
                your first lazy mistake.
              </p>
              <br />
              <p style="font-size: 14px; font-weight: bold; text-transform: uppercase;">
                Get to work. Pinky is watching.
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Successfully sent aggressive welcome email to ${email}`);

      } catch (e) {
        console.error('Failed to process webhook fulfillment:', e);
        return NextResponse.json({ error: 'Database/Email Fulfillment Error' }, { status: 500 });
      }
    } else {
      console.warn(`Webhook received for email ${email} but missing waitlistId / client_reference_id.`);
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

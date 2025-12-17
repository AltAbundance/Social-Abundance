// Vercel Serverless Function for Stripe Webhooks
// Place this in /api/webhook-stripe.js

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user subscription in database
      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          plan_id: 'pro',
          updated_at: new Date().toISOString()
        })
        .eq('id', session.metadata.userId);
      
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      
      // Downgrade user to free tier
      await supabase
        .from('users')
        .update({
          subscription_status: 'canceled',
          plan_id: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', subscription.customer);
      
      break;

    case 'invoice.payment_failed':
      // Handle failed payment
      const invoice = event.data.object;
      
      await supabase
        .from('users')
        .update({
          subscription_status: 'past_due',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_customer_id', invoice.customer);
      
      break;
  }

  res.json({ received: true });
}
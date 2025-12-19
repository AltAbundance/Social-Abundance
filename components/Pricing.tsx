import React, { useState } from 'react';
import { PRICING_PLANS, type PlanId } from '../config/pricing';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export const Pricing: React.FC = () => {
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (planId: PlanId) => {
    if (planId === 'free') return;
    
    setLoading(planId);
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      // In a real app, you'd call your backend to create a checkout session
      const plan = PRICING_PLANS[planId];
      const selectedPriceId = billingCycle === 'yearly' && plan.annualPriceId 
        ? plan.annualPriceId 
        : plan.priceId;

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPriceId,
          billingCycle,
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe error:', error);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="pricing-container">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Choose Your Plan
      </h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <button
          onClick={() => setBillingCycle('monthly')}
          style={{
            padding: '0.5rem 1rem',
            background: billingCycle === 'monthly' ? '#3b82f6' : 'transparent',
            color: billingCycle === 'monthly' ? 'white' : '#3b82f6',
            border: '1px solid #3b82f6',
            borderRadius: '4px 0 0 4px',
            cursor: 'pointer'
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          style={{
            padding: '0.5rem 1rem',
            background: billingCycle === 'yearly' ? '#3b82f6' : 'transparent',
            color: billingCycle === 'yearly' ? 'white' : '#3b82f6',
            border: '1px solid #3b82f6',
            borderRadius: '0 4px 4px 0',
            cursor: 'pointer'
          }}
        >
          Yearly (Save 20%)
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {Object.entries(PRICING_PLANS).map(([key, plan]) => {
          const planId = key as PlanId;
          const yearlyPrice = plan.price * 12 * 0.8; // 20% discount
          const displayPrice = billingCycle === 'monthly' ? plan.price : Math.floor(yearlyPrice / 12);
          
          return (
            <div
              key={planId}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '2rem',
                background: planId === 'pro' ? '#f3f4f6' : 'white',
                position: 'relative',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {planId === 'pro' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#3b82f6',
                  color: 'white',
                  padding: '0.25rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>
              )}
              
              <h3 style={{ marginBottom: '1rem' }}>{plan.name}</h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
                  ${displayPrice}
                </span>
                <span style={{ color: '#6b7280' }}>/month</span>
                {billingCycle === 'yearly' && plan.price > 0 && (
                  <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
                    Billed ${Math.floor(yearlyPrice)} annually
                  </div>
                )}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {plan.features.map((feature, index) => (
                  <li key={index} style={{ 
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'flex-start'
                  }}>
                    <span style={{ color: '#10b981', marginRight: '0.5rem' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(planId)}
                disabled={loading !== null}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: planId === 'free' ? '#6b7280' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loading === planId ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  opacity: loading === planId ? 0.6 : 1
                }}
              >
                {loading === planId ? 'Processing...' : 
                 planId === 'free' ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
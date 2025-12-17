import React from 'react';
import { PRICING_PLANS } from '../config/pricing';

interface FeatureComparisonProps {
  show: boolean;
  onClose: () => void;
  highlightFeature?: string;
}

export const FeatureComparison: React.FC<FeatureComparisonProps> = ({ show, onClose, highlightFeature }) => {
  if (!show) return null;

  const features = [
    { name: 'AI Posts per Month', free: '10', pro: 'Unlimited', hot: true },
    { name: 'Content Types', free: 'Text only', pro: 'Text, Images, Carousels, Threads' },
    { name: 'Social Platforms', free: '2 (Twitter & LinkedIn)', pro: 'All platforms' },
    { name: 'Viral Lab', free: '❌', pro: '✅ Test & optimize content', hot: true },
    { name: 'Trend Hunter', free: '❌', pro: '✅ Real-time trends', hot: true },
    { name: 'Content DNA™', free: '❌', pro: '✅ Your unique voice' },
    { name: 'Audience Personas', free: '❌', pro: '✅ Target segments' },
    { name: 'Content Calendar', free: '❌', pro: '✅ Schedule posts' },
    { name: 'Analytics', free: '❌', pro: '✅ Performance insights' },
    { name: 'Saved Templates', free: '5', pro: 'Unlimited' },
    { name: 'Export Content', free: '❌', pro: '✅ CSV export' },
    { name: 'Watermark', free: 'Yes', pro: 'No watermark' },
    { name: 'Support', free: 'Community', pro: 'Priority support' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280'
          }}
        >
          ×
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          See What You're Missing 👀
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
          Join 10,000+ creators who've upgraded to Pro
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gap: '1px',
          background: '#e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{ background: '#f9fafb', padding: '1rem', fontWeight: 'bold' }}>
            Feature
          </div>
          <div style={{ background: '#f9fafb', padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>
            Free
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Pro
          </div>

          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div style={{
                background: 'white',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: highlightFeature === feature.name ? 'bold' : 'normal',
                color: highlightFeature === feature.name ? '#667eea' : 'inherit'
              }}>
                {feature.name}
                {feature.hot && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.625rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '9999px',
                    fontWeight: 'bold'
                  }}>
                    HOT
                  </span>
                )}
              </div>
              <div style={{
                background: 'white',
                padding: '1rem',
                textAlign: 'center',
                color: feature.free === '❌' ? '#ef4444' : '#6b7280'
              }}>
                {feature.free}
              </div>
              <div style={{
                background: '#f3f4f6',
                padding: '1rem',
                textAlign: 'center',
                color: feature.pro.includes('✅') ? '#10b981' : '#111827',
                fontWeight: 'bold'
              }}>
                {feature.pro}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Ready to Level Up?</h3>
          <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
            Get instant access to all Pro features
          </p>
          <button
            onClick={() => window.location.href = '/pricing'}
            style={{
              background: 'white',
              color: '#667eea',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Upgrade Now - $29/month
          </button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
            Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};
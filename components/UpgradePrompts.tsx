import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { PRICING_PLANS } from '../config/pricing';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'limit' | 'feature' | 'success';
  featureName?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, trigger, featureName }) => {
  if (!isOpen) return null;

  const messages = {
    limit: {
      title: "You're on fire! 🔥",
      subtitle: "You've used all your free posts this month",
      description: "Unlock unlimited content creation and watch your social presence explode"
    },
    feature: {
      title: "Premium Feature",
      subtitle: `${featureName} is a Pro feature`,
      description: "Join thousands of creators who've 10x'd their engagement with Pro tools"
    },
    success: {
      title: "Your content is performing great!",
      subtitle: "Imagine what you could do with Pro features",
      description: "Pro users see 3x more engagement on average"
    }
  };

  const msg = messages[trigger];

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
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '500px',
        width: '90%',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out'
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

        <h2 style={{ marginBottom: '0.5rem' }}>{msg.title}</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{msg.subtitle}</p>
        <p style={{ marginBottom: '2rem' }}>{msg.description}</p>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>$29</span>
            <span style={{ opacity: 0.8, marginLeft: '0.5rem' }}>/month</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              marginLeft: 'auto',
              fontSize: '0.875rem'
            }}>
              SAVE 20% annually
            </span>
          </div>
          <p style={{ opacity: 0.9, marginBottom: '1rem' }}>Unlimited everything + Premium features</p>
          
          <button
            onClick={() => window.location.href = '/pricing'}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Upgrade to Pro →
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Join 10,000+ creators already using Pro
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
            {'⭐⭐⭐⭐⭐'.split('').map((star, i) => (
              <span key={i} style={{ color: '#fbbf24' }}>{star}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FloatingUpgradeButton: React.FC = () => {
  const { user, getRemainingPosts } = useUser();
  const [showPulse, setShowPulse] = useState(false);
  
  const remaining = getRemainingPosts();
  const isLowOnPosts = remaining > 0 && remaining <= 3;

  useEffect(() => {
    if (isLowOnPosts) {
      setShowPulse(true);
    }
  }, [isLowOnPosts]);

  if (user?.subscription.planId === 'pro' || remaining === -1) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 999
    }}>
      <button
        onClick={() => window.location.href = '/pricing'}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          animation: showPulse ? 'pulse 2s infinite' : undefined
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 'bold' }}>Upgrade to Pro</div>
          {isLowOnPosts && (
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
              Only {remaining} posts left
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export const FeatureTeaser: React.FC<{ featureName: string }> = ({ featureName }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '2rem',
        background: '#f9fafb',
        borderRadius: '12px',
        border: '2px dashed #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-12px',
        right: '1rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold'
      }}>
        PRO
      </div>

      <div style={{
        filter: 'blur(3px)',
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{featureName}</h3>
        <p style={{ color: '#6b7280' }}>
          This premium feature helps you create viral content that gets 10x more engagement
        </p>
      </div>

      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          whiteSpace: 'nowrap'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>🔒 Unlock with Pro</p>
          <button
            onClick={() => window.location.href = '/pricing'}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            See Pricing →
          </button>
        </div>
      )}
    </div>
  );
};

export const SuccessNotification: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: '12px',
      padding: '1rem 2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      animation: 'slideDown 0.5s ease-out',
      zIndex: 1000
    }}>
      <span style={{ fontSize: '2rem' }}>🎉</span>
      <div>
        <p style={{ fontWeight: 'bold' }}>Great content created!</p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Pro users get 3x more engagement
        </p>
      </div>
    </div>
  );
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    50% {
      box-shadow: 0 4px 30px rgba(102, 126, 234, 0.5);
    }
    100% {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
  }
`;
document.head.appendChild(style);
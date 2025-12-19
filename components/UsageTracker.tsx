import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

export const UsageTracker: React.FC = () => {
  const { user, getRemainingPosts, isProUser, updateSubscription } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  
  if (!user || isProUser() || !isVisible) return null;
  
  const remaining = getRemainingPosts();
  const total = 10; // Free tier limit
  const used = total - remaining;
  const percentage = (used / total) * 100;
  
  const getColor = () => {
    if (percentage < 50) return '#10b981';
    if (percentage < 80) return '#f59e0b';
    return '#ef4444';
  };
  
  const getEmoji = () => {
    if (percentage < 50) return '😊';
    if (percentage < 80) return '🤔';
    return '😱';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'white',
      borderRadius: '12px',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      minWidth: '250px',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Monthly Posts</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>{getEmoji()}</span>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              lineHeight: 1
            }}
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{
          background: '#e5e7eb',
          borderRadius: '9999px',
          height: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            background: getColor(),
            height: '100%',
            width: `${percentage}%`,
            transition: 'all 0.3s ease',
            borderRadius: '9999px'
          }} />
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280' }}>
        <span>{used} used</span>
        <span>{remaining} remaining</span>
      </div>
      
      {percentage >= 80 && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          background: '#fef3c7',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: '#92400e'
        }}>
          {percentage === 100 
            ? "You've reached your limit! Upgrade to keep creating 🚀"
            : `Only ${remaining} posts left! Upgrade for unlimited content ✨`
          }
        </div>
      )}
      
      {/* Debug info - remove in production */}
      <div style={{ marginTop: '0.5rem', fontSize: '0.625rem', color: '#6b7280', opacity: 0.7 }}>
        User: {user?.subscription?.planId || 'unknown'} | Remaining: {remaining}
      </div>
      
      {/* Temporary test button - remove in production */}
      <button
        onClick={() => updateSubscription('pro')}
        style={{
          width: '100%',
          padding: '0.5rem',
          marginTop: '0.5rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.75rem',
          cursor: 'pointer'
        }}
      >
        Test: Upgrade to Pro
      </button>
    </div>
  );
};
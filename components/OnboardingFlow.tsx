import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  action: () => void;
  completed: boolean;
}

export const OnboardingFlow: React.FC = () => {
  const { user, isProUser } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const steps: OnboardingStep[] = [
    {
      id: 'first-post',
      title: 'Create Your First Viral Post',
      description: 'Generate AI-powered content in seconds',
      action: () => console.log('Generate post'),
      completed: false
    },
    {
      id: 'voice-setup',
      title: 'Train Your AI Voice',
      description: 'Help AI understand your unique style',
      action: () => console.log('Setup voice'),
      completed: false
    },
    {
      id: 'schedule-week',
      title: 'Schedule Your First Week',
      description: 'Plan content ahead and stay consistent',
      action: () => console.log('Schedule content'),
      completed: false
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '0.5rem' }}>
        Welcome! Let's make you go viral 🚀
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Complete these steps to unlock your content creation superpowers
      </p>

      {/* Progress Bar */}
      <div style={{
        background: '#e5e7eb',
        borderRadius: '9999px',
        height: '8px',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
          height: '100%',
          width: `${((currentStep + 1) / steps.length) * 100}%`,
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            background: index === currentStep ? '#f3f4f6' : 'transparent',
            borderRadius: '8px',
            marginBottom: '1rem',
            cursor: index === currentStep ? 'pointer' : 'default',
            transition: 'all 0.3s ease'
          }}
          onClick={index === currentStep ? step.action : undefined}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: step.completed ? '#10b981' : index === currentStep ? '#3b82f6' : '#e5e7eb',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
            fontWeight: 'bold'
          }}>
            {step.completed ? '✓' : index + 1}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>
              {step.title}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {step.description}
            </p>
          </div>

          {index === currentStep && (
            <button
              onClick={step.action}
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
              Start →
            </button>
          )}
        </div>
      ))}

      {/* Success State */}
      {currentStep === steps.length - 1 && (
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#ecfdf5',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#065f46', fontWeight: 'bold' }}>
            🎉 You're all set! Time to create amazing content
          </p>
          {!isProUser() && (
            <p style={{ color: '#059669', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Pro tip: Upgrade to unlock unlimited posts and premium features
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Quick Win Component - Shows immediate value
export const QuickWin: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const samplePost = {
    content: "🚀 Just discovered the secret to 10x productivity:\n\n1. Start with your hardest task\n2. Take breaks every 25 minutes\n3. Say 'no' to meetings without agendas\n\nWhat's your #1 productivity hack? Share below! 👇\n\n#ProductivityTips #TimeManagement #WorkSmarter",
    platform: 'linkedin'
  };

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => onComplete(), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePost.content);
    setCopied(true;
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>
        Let's create your first viral post! 🎯
      </h3>

      {!generated ? (
        <button
          onClick={handleGenerate}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)'
          }}
        >
          Generate My First Post ✨
        </button>
      ) : (
        <div style={{
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6
          }}>
            {samplePost.content}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#10b981' : '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.3s ease'
              }}
            >
              {copied ? 'Copied! ✓' : 'Copy to Clipboard'}
            </button>

            <button
              onClick={onComplete}
              style={{
                background: 'white',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Create Another →
            </button>
          </div>

          <p style={{
            marginTop: '1rem',
            color: '#10b981',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            ✨ Wow! This post typically gets 3-5x more engagement than average
          </p>
        </div>
      )}
    </div>
  );
};
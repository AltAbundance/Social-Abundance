import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export const SocialAbundanceLogo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  showText = true,
  className = '' 
}) => {
  const sizes = {
    small: { icon: 40, text: 16 },
    medium: { icon: 60, text: 24 },
    large: { icon: 100, text: 36 }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        {/* Main Logo Container */}
        <div 
          className="relative flex items-center justify-center"
          style={{ 
            width: currentSize.icon, 
            height: currentSize.icon 
          }}
        >
          {/* Animated background gradient */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 animate-pulse"
            style={{ transform: 'rotate(6deg)' }}
          />
          
          {/* Main icon background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg" />
          
          {/* Icon */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="relative z-10 text-white"
            style={{ 
              width: currentSize.icon * 0.6, 
              height: currentSize.icon * 0.6 
            }}
          >
            {/* Multiplication/abundance symbol */}
            <path 
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            
            {/* Small sparkles */}
            <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="18" cy="6" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="6" cy="18" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="18" cy="18" r="1" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="mt-4 text-center">
          <h1 
            className="font-black tracking-tight leading-none"
            style={{ fontSize: `${currentSize.text}px` }}
          >
            <span className="text-slate-900">SOCIAL</span>
            <br />
            <span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              style={{ fontSize: `${currentSize.text * 0.8}px` }}
            >
              ABUNDANCE
            </span>
          </h1>
          {size === 'large' && (
            <p className="mt-2 text-slate-600 text-sm font-medium">
              AI-Powered Social Media Content
            </p>
          )}
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  weeklyGoal: number;
  weeklyProgress: number;
  nextReward: {
    days: number;
    reward: string;
  };
}

export const StreakTracker: React.FC = () => {
  const { user } = useUser();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: new Date().toISOString(),
    weeklyGoal: 7,
    weeklyProgress: 0,
    nextReward: {
      days: 7,
      reward: '🎁 Unlock 5 bonus posts'
    }
  });

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('streakData');
    if (saved) {
      setStreakData(JSON.parse(saved));
    }

    // Check if streak is broken
    const lastActive = new Date(streakData.lastActiveDate);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      // Streak broken - this creates loss aversion
      setStreakData(prev => ({
        ...prev,
        currentStreak: 0
      }));
    }
  }, []);

  const getStreakEmoji = () => {
    const { currentStreak } = streakData;
    if (currentStreak === 0) return '😢';
    if (currentStreak < 3) return '🌱';
    if (currentStreak < 7) return '🔥';
    if (currentStreak < 30) return '🚀';
    return '🏆';
  };

  const getMotivationalMessage = () => {
    const { currentStreak, weeklyProgress, weeklyGoal } = streakData;
    
    if (currentStreak === 0) {
      return "Start your streak today! Your audience is waiting 🎯";
    }
    
    if (weeklyProgress >= weeklyGoal) {
      return "Weekly goal crushed! You're unstoppable 💪";
    }
    
    if (currentStreak >= 7) {
      return `${currentStreak} day streak! You're in the top 10% of creators 🌟`;
    }
    
    return `Keep going! ${weeklyGoal - weeklyProgress} posts to hit your weekly goal`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{getStreakEmoji()}</span>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {streakData.currentStreak} Day Streak
              </h3>
              <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>
                {getMotivationalMessage()}
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Next Reward</div>
          <div style={{ fontWeight: 'bold' }}>
            {streakData.nextReward.days - streakData.currentStreak} days
          </div>
        </div>
      </div>

      {/* Weekly Progress Bar */}
      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
          <span>Weekly Goal</span>
          <span>{streakData.weeklyProgress}/{streakData.weeklyGoal} posts</span>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '9999px',
          height: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'white',
            height: '100%',
            width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%`,
            transition: 'width 0.3s ease',
            borderRadius: '9999px'
          }} />
        </div>
      </div>

      {/* Loss Aversion Warning */}
      {streakData.currentStreak > 3 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>⚠️</span>
          <span>Don't break your streak! Post by midnight to keep it alive</span>
        </div>
      )}
    </div>
  );
};
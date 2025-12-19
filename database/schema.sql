-- Supabase Database Schema for Social Abundance
-- Run this in your Supabase SQL editor

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  firebase_uid TEXT UNIQUE,
  display_name TEXT,
  photo_url TEXT,
  
  -- Subscription info
  plan_id TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP,
  
  -- Usage tracking
  posts_this_month INTEGER DEFAULT 0,
  last_post_reset TIMESTAMP DEFAULT NOW(),
  
  -- Engagement tracking
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_posts_created INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content table
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content details
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  
  -- Performance metrics
  ai_predicted_engagement INTEGER,
  actual_engagement INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  scheduled_for TIMESTAMP,
  published_at TIMESTAMP,
  
  -- Features used
  used_viral_lab BOOLEAN DEFAULT FALSE,
  used_trend_hunter BOOLEAN DEFAULT FALSE
);

-- User templates
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  platform TEXT,
  category TEXT,
  
  times_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User settings and preferences
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  
  -- Voice settings
  tone_settings JSONB DEFAULT '{}',
  content_dna JSONB DEFAULT '{}',
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  -- Feature preferences
  default_platform TEXT DEFAULT 'twitter',
  weekly_goal INTEGER DEFAULT 7,
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_content_user_id ON content(user_id);
CREATE INDEX idx_content_created_at ON content(created_at);
CREATE INDEX idx_templates_user_id ON templates(user_id);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = firebase_uid);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = firebase_uid);

CREATE POLICY "Users can view own content" ON content
  FOR ALL USING (user_id = (SELECT id FROM users WHERE firebase_uid = auth.uid()));

CREATE POLICY "Users can manage own templates" ON templates
  FOR ALL USING (user_id = (SELECT id FROM users WHERE firebase_uid = auth.uid()));

CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (user_id = (SELECT id FROM users WHERE firebase_uid = auth.uid()));

-- Functions
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to reset monthly post count
CREATE OR REPLACE FUNCTION reset_monthly_posts()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET posts_this_month = 0,
      last_post_reset = NOW()
  WHERE last_post_reset < date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS void AS $$
DECLARE
  last_active DATE;
  current_streak_val INTEGER;
BEGIN
  SELECT last_active_date, current_streak INTO last_active, current_streak_val
  FROM users WHERE id = user_uuid;
  
  IF last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Continue streak
    UPDATE users 
    SET current_streak = current_streak + 1,
        last_active_date = CURRENT_DATE,
        longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE id = user_uuid;
  ELSIF last_active < CURRENT_DATE - INTERVAL '1 day' THEN
    -- Streak broken
    UPDATE users 
    SET current_streak = 1,
        last_active_date = CURRENT_DATE
    WHERE id = user_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;
-- Run this AFTER creating the tables
-- Row Level Security Policies for Supabase

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own content" ON content;
DROP POLICY IF EXISTS "Users can manage own templates" ON templates;
DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;

-- For development/testing - Allow all access
-- Replace these with proper policies for production

-- Users table policies
CREATE POLICY "Enable all for users" ON users
  FOR ALL USING (true);

-- Content table policies  
CREATE POLICY "Enable all for content" ON content
  FOR ALL USING (true);

-- Templates table policies
CREATE POLICY "Enable all for templates" ON templates
  FOR ALL USING (true);

-- User settings policies
CREATE POLICY "Enable all for user_settings" ON user_settings
  FOR ALL USING (true);

-- Note: For production, replace with proper RLS policies like:
-- CREATE POLICY "Users can view own profile" ON users
--   FOR SELECT USING (id::text = auth.uid());
-- CREATE POLICY "Users can update own profile" ON users  
--   FOR UPDATE USING (id::text = auth.uid());
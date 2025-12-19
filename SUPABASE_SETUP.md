# 🚀 Supabase Setup Instructions

## Step 1: Run the Schema

1. Go to your Supabase project
2. Click on **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the content from `database/schema-fixed.sql`
5. Click **Run** (or press F5)

You should see: "Success. No rows returned"

## Step 2: Run RLS Policies

1. Still in SQL Editor
2. Click **New Query** again  
3. Copy and paste the content from `database/rls-policies.sql`
4. Click **Run**

## Step 3: Get Your API Keys

1. Go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...`
   - **service_role** (keep secret!): `eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...`

## Step 4: Update Your .env.local

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Step 5: Test Your Setup

Run this query in SQL Editor to test:
```sql
-- Insert test user
INSERT INTO users (email, display_name, plan_id)
VALUES ('test@example.com', 'Test User', 'free');

-- Check if it worked
SELECT * FROM users;
```

## Common Issues:

**"operator does not exist: uuid = text"**
- This happens when UUID types don't match
- The fixed schema should prevent this

**"permission denied for table users"**  
- Make sure RLS policies are applied
- Check that you're using the anon key in frontend

**"relation does not exist"**
- Make sure you ran the schema first
- Check you're in the right project

## Next Steps:

1. ✅ Database is set up
2. Next: Set up Firebase Authentication
3. Then: Configure Stripe
4. Finally: Deploy to Vercel

Your database is now ready to store users, content, and subscriptions!
# 🚀 Social Abundance - Complete Setup Guide

## 🔐 How Authentication Works

### Login Flow:
1. User clicks "Login" → Opens `AuthModal` component
2. User chooses login method (Google/Facebook/Email)
3. Firebase handles the authentication
4. User data is stored in your database
5. App updates to show logged-in state

### Code Flow:
```
User clicks Login
    ↓
AuthModal opens
    ↓
Firebase Auth (Google/Facebook/etc)
    ↓
Returns user object
    ↓
Sync with your database (Supabase)
    ↓
Update UserContext
    ↓
App shows Pro/Free features
```

## 💳 How "Get Pro" Works

### Payment Flow:
1. User clicks "Get Pro" button
2. Creates Stripe Checkout session
3. Redirects to Stripe's secure payment page
4. User enters card details (on Stripe's site)
5. After payment, Stripe webhook updates your database
6. User gets Pro access immediately

### Code Flow:
```
User clicks "Get Pro"
    ↓
Call /api/create-checkout-session
    ↓
Stripe returns session URL
    ↓
Redirect to Stripe Checkout
    ↓
User pays on Stripe's page
    ↓
Stripe webhook → /api/webhook-stripe
    ↓
Update user to Pro in database
    ↓
User has Pro access!
```

## 🛠️ What You Need to Set Up

### 1. Firebase (5 minutes)
```bash
# Go to console.firebase.google.com
1. Create new project (FREE)
2. Enable Authentication
3. Add Google/Facebook providers
4. Get your config keys
```

### 2. Stripe (10 minutes)
```bash
# Go to dashboard.stripe.com
1. Create account (FREE)
2. Get API keys (test mode first)
3. Create products:
   - Pro Monthly: $29/month
4. Set up webhook endpoint
```

### 3. Supabase (5 minutes)
```bash
# Go to supabase.com
1. Create new project (FREE)
2. Get API keys
3. Create tables (I'll provide SQL)
```

## 📝 Step-by-Step Setup

### Step 1: Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Go to Authentication → Sign-in methods
4. Enable:
   - Email/Password
   - Google (requires Google Cloud Console setup)
   - Facebook (requires Facebook App)
5. Get config from Project Settings

### Step 2: Stripe Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your API keys:
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`
3. Create a Product:
   - Name: "Social Abundance Pro"
   - Price: $29/month
   - Get the price ID: `price_...`

### Step 3: Update Your Code
Create `.env.local` file:
```env
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Update Pricing Config
In `config/pricing.ts`, update:
```typescript
pro: {
  priceId: 'price_YOUR_ACTUAL_STRIPE_PRICE_ID', // Replace this!
}
```

### Step 5: Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy!

## 🔄 How Everything Connects

```
Frontend (React)
    ↓
Firebase Auth (handles login)
    ↓
Your API (/api folder)
    ↓
Stripe (handles payments)
    ↓
Supabase (stores user data)
    ↓
Back to Frontend (Pro features unlocked)
```

## ⚠️ Important Notes

1. **You handle NO sensitive data** - Firebase handles passwords, Stripe handles cards
2. **Start with TEST mode** - Use Stripe test keys first
3. **No credit card required** for setup - All services have free tiers

## 🧪 Testing the Flow

1. **Test Login:**
   - Click login
   - Use Google (easiest)
   - Should see logged-in state

2. **Test Payment:**
   - Use Stripe test card: 4242 4242 4242 4242
   - Any future date, any CVC
   - Should redirect back as Pro user

## 🚨 Common Issues

1. **Login not working:**
   - Check Firebase config
   - Enable auth providers
   - Check console for errors

2. **Payment not working:**
   - Check Stripe keys
   - Verify price ID is correct
   - Check webhook is set up

3. **Pro features not unlocking:**
   - Check database connection
   - Verify webhook is updating user
   - Check UserContext is refreshing

## 💡 Do You Need to Give Me Stripe Info?

**NO!** You should:
1. Create your own Stripe account
2. Get your own API keys
3. Never share secret keys with anyone
4. Only use publishable keys in frontend

I've built the integration - you just need to plug in your keys!
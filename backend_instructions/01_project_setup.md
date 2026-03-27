# Step 1: Project Setup & Dependencies

GiftGenie AI is building an emotion-based smart gifting platform with a premium, frontend-focused design and a robust backend. 
You already have the frontend UI generated via Stitch MCP (located in the `site/public/` directory).

Now, you need to set up the Next.js 14 App Router project and lay the foundation for the backend.

## 1. Initialize Next.js Project
Create a new Next.js app in a new folder or alongside the current site files. Use the following command:

```bash
npx create-next-app@latest . --js --app --eslint --tailwind --src-dir --import-alias "@/*"
```
*(Choose 'Yes' for Tailwind CSS if you want to integrate the generated HTML easily,, or stick to vanilla CSS as per the original plan if preferred).*

## 2. Install Core Dependencies
Install the required packages for the backend and AI integration:

```bash
npm install @prisma/client next-auth @google/generative-ai stripe lucide-react bcryptjs
npm install -D prisma
```

## 3. Setup Environment Variables
Create a `.env.local` file in the root of your project:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here" # Generate one using: openssl rand -base64 32

# Google Auth (Optional, for OAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 4. Initialize Prisma
Initialize Prisma for SQLite to start local development:

```bash
npx prisma init --datasource-provider sqlite
```

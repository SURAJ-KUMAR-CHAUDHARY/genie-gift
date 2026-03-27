# GiftGenie AI

The future of gifting is here. Tell us about the person, their emotions, and the occasion — our AI finds the perfect gift.

## Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SURAJ-KUMAR-CHAUDHARY/genie-gift.git
cd genie-gift
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
DATABASE_URL=file:./dev.db
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys your app to GitHub Pages when you push to the main branch.

1. Ensure your GitHub Pages is set to deploy from the `gh-pages` branch
2. Push your changes to the main branch:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. The workflow will automatically:
   - Build your Next.js application
   - Export it as a static site
   - Deploy to GitHub Pages

### Option 2: Manual Deployment

1. Build and export your application:
```bash
npm run build
npm run export
```

2. Deploy to GitHub Pages:
```bash
git subtree push --prefix out origin gh-pages
```

3. Or manually:
   - Go to your GitHub repository settings
   - Under 'Pages', set source to 'Deploy from a branch'
   - Select 'gh-pages' branch
   - Push the 'out' directory to the 'gh-pages' branch

## Features

- **AI-Powered Gift Suggestions**: Describe the person and occasion, get perfect gift ideas
- **Emotion-Based Shopping**: Browse gifts by emotion (Love, Joy, Gratitude, Surprise)
- **User Authentication**: Secure login and registration
- **Shopping Cart**: Add and manage items before checkout
- **Stripe Integration**: Secure payment processing
- **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js
- **AI**: Google Gemini API
- **Payments**: Stripe
- **Deployment**: GitHub Pages

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── cart/              # Cart page
│   ├── dashboard/         # User dashboard
│   ├── discover/          # Gift discovery
│   ├── login/             # Authentication
│   └── page.js            # Home page
├── components/            # Reusable components
├── lib/                   # Utility functions
└── globals.css           # Global styles

prisma/
├── schema.prisma         # Database schema
└── seed.js              # Database seeding

.github/workflows/
└── deploy.yml           # GitHub Actions deployment
```

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/products` - Get all products
- `POST /api/cart` - Add to cart
- `GET /api/cart` - Get cart items
- `POST /api/ai/suggest` - AI gift suggestions
- `POST /api/stripe/checkout` - Stripe checkout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/SURAJ-KUMAR-CHAUDHARY/genie-gift/issues) section
2. Create a new issue if needed

## Contact

For business inquiries or support:
- Email: [your-email@example.com](mailto:your-email@example.com)
- Website: [your-website.com](https://your-website.com)

---

**Note**: This application is configured for GitHub Pages deployment. The main deployment workflow is automated via GitHub Actions.
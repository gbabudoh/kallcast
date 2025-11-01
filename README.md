# 🎥 Kallcast - Live Video Learning Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</div>

<br />

<div align="center">
  <h3>🚀 Connect with expert coaches for transformative live video learning sessions</h3>
  <p>A modern, enterprise-grade platform built with Next.js 15, featuring real-time video coaching, secure payments, and dynamic user experiences.</p>
</div>

---

## ✨ Features

### 🎯 **Core Platform Features**
- **Live Video Coaching**: HD video sessions with screen sharing and interactive tools
- **Two-Sided Marketplace**: Separate experiences for learners and coaches
- **Real-Time Scheduling**: Dynamic booking system with timezone support
- **Secure Payments**: Stripe integration with automatic coach payouts
- **Session Management**: Complete booking lifecycle from discovery to completion
- **Progress Tracking**: Learning analytics and achievement system

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Professional UI with backdrop blur effects
- **Gradient Themes**: Consistent blue/purple/indigo color schemes
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dynamic Components**: Real-time updates and interactive elements

### 🔐 **Authentication & Security**
- **NextAuth.js Integration**: Secure authentication with multiple providers
- **Role-Based Access**: Separate dashboards for learners and coaches
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Secure user session handling

### 💳 **Payment System**
- **Stripe Connect**: Automated coach payouts (80% to coach, 20% platform fee)
- **Secure Checkout**: PCI-compliant payment processing
- **Refund System**: Automated refund handling for cancellations
- **Payment Analytics**: Earnings tracking and reporting

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hook Form** - Form handling with validation
- **Zustand** - Lightweight state management

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **NextAuth.js** - Authentication library
- **Zod** - Schema validation

### **Integrations**
- **Daily.co** - Video calling infrastructure
- **Stripe** - Payment processing and Connect
- **Resend** - Transactional email service
- **Pusher** - Real-time notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Stripe account
- Daily.co account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gbabudoh/kallcast.git
   cd kallcast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/kallcast
   
   # NextAuth.js
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here
   
   # Daily.co
   DAILY_API_KEY=your_daily_api_key_here
   
   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key_here
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
kallcast/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── ui/                # UI components
│   │   └── shared/            # Shared components
│   ├── lib/                   # Utility libraries
│   ├── models/                # Database models
│   ├── types/                 # TypeScript type definitions
│   ├── validations/           # Zod validation schemas
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🎯 User Flows

### **For Learners**
1. **Sign Up** → Choose "Learner" role during registration
2. **Explore Coaches** → Browse by category, skills, or search
3. **Book Session** → Select time slot and complete payment
4. **Join Session** → One-click access to HD video room
5. **Track Progress** → View completed sessions and achievements

### **For Coaches**
1. **Sign Up** → Choose "Coach" role and complete profile
2. **Create Availability** → Set up time slots and pricing
3. **Receive Bookings** → Get notified of new session requests
4. **Conduct Sessions** → Use professional video tools
5. **Get Paid** → Automatic payouts via Stripe Connect

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Database Models**
- **User** - Learners and coaches with role-based fields
- **Slot** - Available time slots created by coaches
- **Booking** - Session bookings with payment info
- **Session** - Live session data and recordings
- **Review** - Session feedback and ratings
- **Payment** - Payment transactions and payouts

### **API Endpoints**
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/coaches/*` - Coach profiles and discovery
- `/api/slots/*` - Time slot management
- `/api/bookings/*` - Session booking system
- `/api/payments/*` - Stripe payment processing
- `/api/video/*` - Daily.co video room management

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue to Purple gradients (`from-blue-600 to-purple-600`)
- **Secondary**: Indigo variations (`from-indigo-500 to-blue-600`)
- **Success**: Green (`from-green-500 to-green-600`)
- **Warning**: Orange (`from-orange-500 to-orange-600`)

### **Components**
- **Logo Component** - Consistent branding across platform
- **Gradient Cards** - Professional card designs with hover effects
- **Animated Buttons** - Interactive buttons with smooth transitions
- **Loading Spinners** - Multiple loading state components

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### **Other Platforms**
- **Netlify** - Full-stack deployment with serverless functions
- **Railway** - Simple deployment with database hosting
- **DigitalOcean** - VPS deployment with Docker

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For hosting and deployment platform
- **Daily.co** - For video infrastructure
- **Stripe** - For payment processing
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

- **Documentation**: [docs.kallcast.com](https://docs.kallcast.com)
- **Issues**: [GitHub Issues](https://github.com/gbabudoh/kallcast/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gbabudoh/kallcast/discussions)
- **Email**: support@kallcast.com

---

<div align="center">
  <p>Built with ❤️ by the Kallcast Team</p>
  <p>
    <a href="https://kallcast.com">Website</a> •
    <a href="https://docs.kallcast.com">Documentation</a> •
    <a href="https://github.com/gbabudoh/kallcast/issues">Report Bug</a> •
    <a href="https://github.com/gbabudoh/kallcast/discussions">Request Feature</a>
  </p>
</div>
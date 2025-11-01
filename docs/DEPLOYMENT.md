# 🚀 Deployment Guide

This guide covers deploying Kallcast to various platforms and environments.

## 📋 Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Stripe webhooks configured
- [ ] Daily.co API keys set up
- [ ] Email service configured
- [ ] Domain and SSL certificates ready

## 🌐 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments and serverless functions.

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `kallcast` repository

### Step 2: Configure Environment Variables
Add all environment variables from `.env.example`:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kallcast

# NextAuth.js
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_your_production_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret

# Daily.co
DAILY_API_KEY=your_production_daily_key

# Resend
RESEND_API_KEY=your_production_resend_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
```

### Step 3: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

### Step 4: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/kallcast
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongo
    networks:
      - kallcast-network

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    networks:
      - kallcast-network

volumes:
  mongo-data:

networks:
  kallcast-network:
    driver: bridge
```

### Deploy with Docker
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. Connect your GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables in Amplify console
4. Deploy

### Using EC2 with PM2
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/gbabudoh/kallcast.git
cd kallcast
npm install
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'kallcast',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🌊 DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure app spec:
   ```yaml
   name: kallcast
   services:
   - name: web
     source_dir: /
     github:
       repo: gbabudoh/kallcast
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
   ```
3. Add environment variables
4. Deploy

## 🚄 Railway Deployment

1. Connect your GitHub repository
2. Add environment variables
3. Railway will automatically detect Next.js and deploy

## 📊 Database Setup

### MongoDB Atlas (Recommended)
1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your application's IP addresses
4. Get the connection string
5. Update `MONGODB_URI` environment variable

### Self-hosted MongoDB
```bash
# Install MongoDB
sudo apt-get install -y mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use kallcast
db.createUser({
  user: "kallcast",
  pwd: "your-password",
  roles: ["readWrite"]
})
```

## 🔐 SSL/TLS Configuration

### Let's Encrypt with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📈 Monitoring and Logging

### Sentry Integration
```bash
npm install @sentry/nextjs
```

Add to `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig({
  // Your existing config
}, {
  silent: true,
  org: "your-org",
  project: "kallcast",
});
```

### Vercel Analytics
Add to your app:
```javascript
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔧 Environment-Specific Configurations

### Production Optimizations
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
};
```

### Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database user has proper permissions

3. **Stripe Webhook Issues**
   - Verify webhook endpoint URL
   - Check webhook secret configuration
   - Ensure proper event handling

4. **Video Call Issues**
   - Verify Daily.co API key
   - Check domain whitelist settings
   - Ensure proper HTTPS configuration

### Performance Monitoring
- Use Vercel Analytics for performance insights
- Monitor Core Web Vitals
- Set up error tracking with Sentry
- Implement health check endpoints

## 📞 Support

If you encounter issues during deployment:
- Check the [troubleshooting guide](TROUBLESHOOTING.md)
- Review [GitHub Issues](https://github.com/gbabudoh/kallcast/issues)
- Contact support at deploy@kallcast.com
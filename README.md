# YourMod - Premium Game Mod Sales Platform

A full-stack mod sales website with auto-updating, secure licensing, and admin controls.

## Features

✨ **Flashy Marketing Site** - Dark cyberpunk aesthetic with animations and glassmorphism design  
🔐 **License Key System** - Secure key generation and verification  
📦 **Auto-Update** - Upload new mod versions, always download the latest  
💬 **Discord Integration** - Payments handled via Discord, keys distributed via DM  
👥 **Admin Dashboard** - Manage keys and uploads easily  
⚡ **Modern Stack** - Next.js 14, TypeScript, Tailwind CSS, SQLite  

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
npm install
npm run dev
```

Visit:
- **Landing Page**: http://localhost:3000
- **Download Portal**: http://localhost:3000/download
- **Admin Panel**: http://localhost:3000/admin

Default admin password: `admin`

## Setup

### Update Environment Variables

Edit `.env.local` to customize:
- `ADMIN_PASSWORD_HASH` - Your admin password (bcrypt hash)
- `TOKEN_SECRET` - JWT secret for sessions

To generate a bcrypt hash:
```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('your-password', 10));"
```

### Customize Your Site

1. **Discord Link** - Replace `https://discord.gg/your-discord` in:
   - `components/landing/hero.tsx`
   - `components/landing/pricing.tsx`
   - `components/landing/footer.tsx`

2. **Site Content** - Edit:
   - `components/landing/features.tsx` - Feature list
   - `components/landing/pricing.tsx` - Pricing tiers
   - `app/layout.tsx` - Site title and meta

## Usage

### Admin Panel

1. Login at `/admin` with your password
2. **Generate Keys** - Create license keys for customers
3. **Upload Mod Files** - Drag/drop your mod file
4. **Manage Keys** - Activate, deactivate, or delete keys

### Customer Flow

1. Customer pays on Discord
2. You generate a key in the admin dashboard
3. Send key to customer via Discord DM
4. Customer enters key on `/download` to get latest mod
5. File is automatically updated when you upload new versions

## API Endpoints

### Public
- `POST /api/verify-key` - Verify license key
- `GET /api/download?token=XXX` - Download mod file

### Admin (Requires Login)
- `POST /api/admin/login` - Authenticate
- `POST /api/admin/keys` - Generate keys
- `GET /api/admin/keys` - List keys
- `PATCH /api/admin/keys/[key]` - Toggle key status
- `DELETE /api/admin/keys/[key]` - Delete key
- `POST /api/admin/upload` - Upload mod file

## Database

SQLite database in `data/modsite.db` with:
- `keys` - License keys and status
- `mod_file` - Upload history
- `download_log` - Download tracking

## Deployment

### Environment Variables (Production)

```
ADMIN_PASSWORD_HASH=your-bcrypt-hash
TOKEN_SECRET=your-random-secret
NODE_ENV=production
```

### Deploy to Vercel

```bash
vercel deploy
```

### Self-Hosted

Any Node.js host (Heroku, Railway, DigitalOcean, etc.)

## Security

⚠️ **Change these before going live:**

1. Update `ADMIN_PASSWORD_HASH` with strong password
2. Generate random `TOKEN_SECRET` (min 32 chars)
3. Enable HTTPS only in production
4. Backup `data/modsite.db` regularly
5. Monitor admin access logs
6. Set secure cookie flags in `lib/auth.ts` for production

## Styling

Customize colors in:
- `app/globals.css` - CSS variables
- `components/ui/*.tsx` - Tailwind classes
- `tailwind.config.ts` - Theme configuration

Primary colors: Purple (600) & Blue (600)

## Support

For issues or questions:
1. Check browser console for errors
2. Review server logs (`dev.log`)
3. Verify `.env.local` is configured
4. Ensure `data/` and `uploads/` directories exist

---

Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

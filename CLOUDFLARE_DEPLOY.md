# Cloudflare Deployment Guide

This app runs 100% on Cloudflare using:
- **Pages** + **Workers** - App hosting
- **D1** - SQLite database
- **R2** - File storage

## Prerequisites

1. **Cloudflare Account** - https://dash.cloudflare.com
2. **Namecheap Domain** - Already have `freenull.com`
3. **Git** - Push code to GitHub

---

## Step 1: Set Up Cloudflare D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create mod-sales

# This returns a database_id - save it!
```

Copy the `database_id` and update `wrangler.toml`:
```toml
[[d1_databases]]
database_id = "YOUR-DATABASE-ID-HERE"
```

---

## Step 2: Set Up Cloudflare R2 Bucket

```bash
# Create R2 bucket
wrangler r2 bucket create mod-sales-files
```

---

## Step 3: Install Cloudflare Dependencies

```bash
npm install -D wrangler @cloudflare/next-on-pages
```

Update `package.json` scripts:
```json
{
  "scripts": {
    "build": "next build",
    "build:cloudflare": "next build && npx @cloudflare/next-on-pages",
    "deploy": "npm run build:cloudflare && wrangler publish"
  }
}
```

---

## Step 4: Update Namecheap Nameservers

1. Go to **Namecheap** → Domain management
2. Set nameservers to Cloudflare:
   - `iris.ns.cloudflare.com`
   - `nash.ns.cloudflare.com`
3. Wait 24 hours for propagation

---

## Step 5: Update Cloudflare DNS

In **Cloudflare Dashboard**:
1. Add your domain `freenull.com`
2. Go to **DNS** → Add Record
3. Type: `A` | Name: `@` | Value: `192.0.2.1` (placeholder, will auto-update)

---

## Step 6: Set Environment Variables

In Cloudflare Dashboard, go to your Pages project:
- **Settings** → **Environment Variables**
- Add:
  ```
  ADMIN_PASSWORD_HASH = \$2b\$10\$o3olWpGnQSTE0fDMeyk0ue5e/nZPPK4UaAtlavPH8S7JffMAvs466
  TOKEN_SECRET = your-random-secret-key-here
  ```

---

## Step 7: Deploy

```bash
# Push to GitHub
git add .
git commit -m "Cloudflare deployment setup"
git push

# Deploy to Cloudflare
npm run deploy
```

---

## Troubleshooting

### D1 Database Errors
```bash
# Check database status
wrangler d1 info mod-sales

# Execute SQL in database
wrangler d1 execute mod-sales --remote --command "SELECT * FROM keys"
```

### R2 Upload Issues
```bash
# List R2 buckets
wrangler r2 bucket list

# Check bucket contents
wrangler r2 objects list mod-sales-files
```

### Local Testing
```bash
# Test locally with wrangler
wrangler pages dev .

# Visit: http://localhost:3000
```

---

## Costs

- **D1**: Free tier includes 5GB storage
- **R2**: First 10GB free, then $0.015/GB
- **Pages**: Free tier available
- **Workers**: Free tier includes 100,000 requests/day

---

## After Deployment

1. Visit `https://freenull.com`
2. Admin panel: `https://freenull.com/admin`
3. Download: `https://freenull.com/download`

Everything runs on Cloudflare! 🚀

# 🚀 DEPLOY YOUR APP IN 10 MINUTES

Everything is ready. Follow these steps **exactly**.

---

## STEP 1: Create GitHub Repo

1. Go to https://github.com/new
2. Create repo: `mod-sales`
3. Copy the commands they show you
4. Run them in your terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/mod-sales.git
git branch -M main
git push -u origin main
```

**Done!** Your code is on GitHub.

---

## STEP 2: Set Up Cloudflare

### 2A: Install & Login
```bash
npm install -g wrangler
wrangler login
```
Browser will open - approve it.

### 2B: Create Database
```bash
wrangler d1 create mod-sales
```

**IMPORTANT:** Copy the output. Look for:
```
database_id = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
```

### 2C: Save Database ID
Open `wrangler.toml` and replace:
```toml
database_id = "PASTE-HERE"  # ← Replace with your ID from 2B
```

### 2D: Get Account ID
```bash
wrangler whoami
```

Copy the `account_id` and add to `wrangler.toml`:
```toml
account_id = "PASTE-HERE"
```

### 2E: Create R2 Bucket
```bash
wrangler r2 bucket create mod-sales-files
```

---

## STEP 3: Update Namecheap DNS

1. Go to **Namecheap** (your domain registrar)
2. Find **freenull.com** in your domains
3. Click **Manage**
4. Go to **Nameservers**
5. Change to Cloudflare:
   ```
   iris.ns.cloudflare.com
   nash.ns.cloudflare.com
   ```
6. **Save**
7. Wait 5-10 minutes ⏳

---

## STEP 4: Deploy!

```bash
npm run deploy
```

This will:
- ✅ Build your app
- ✅ Push to Cloudflare
- ✅ Deploy to production

---

## STEP 5: Verify It Works

Wait 2-3 minutes, then visit:

- https://freenull.com (landing page)
- https://freenull.com/download (customer portal)
- https://freenull.com/admin (admin, password: `admin`)

---

## ⚠️ IMPORTANT: Change Admin Password

The default password is `admin`. Change it:

1. Generate new bcrypt hash:
```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('YOUR-NEW-PASSWORD', 10));"
```

2. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
3. **Settings** → **Environment Variables**
4. Update `ADMIN_PASSWORD_HASH` with the new hash
5. Redeploy:
```bash
npm run deploy
```

---

## 🎉 YOU'RE DONE!

Your app is live on **freenull.com** running 100% on Cloudflare!

- **Database**: Cloudflare D1 ✅
- **Files**: Cloudflare R2 ✅
- **Hosting**: Cloudflare Pages ✅
- **Domain**: freenull.com ✅

---

## Troubleshooting

**"Database error"**
```bash
wrangler d1 list
wrangler d1 execute mod-sales --remote --command "SELECT COUNT(*) FROM keys"
```

**"Can't upload files"**
```bash
wrangler r2 bucket list
```

**"Domain not working"**
- Check Cloudflare Dashboard → DNS
- Make sure CNAME is pointing correctly
- Wait 24 hours for DNS to fully propagate

---

## Next Steps

- **Add customers**: Use admin dashboard to generate keys
- **Update Discord link**: Edit files in `components/landing/`
- **Customize**: Change colors, text, pricing in UI components

---

**Questions?** See `CLOUDFLARE_QUICK_START.md` for more details.

**You've got this! 🚀**

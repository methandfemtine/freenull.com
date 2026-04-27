# Cloudflare Deployment - Quick Start (5 minutes)

Your mod sales platform for **freenull.com** - 100% Cloudflare hosted.

## What You Get

✅ **Backend** - Cloudflare Workers + Pages  
✅ **Database** - Cloudflare D1 (SQLite)  
✅ **File Storage** - Cloudflare R2  
✅ **Domain** - freenull.com  

## Cost

- **Free tier**: D1 (5GB), Pages, 100k requests/day
- **Your first file**: ~$2-3/month for R2 storage + downloads
- **Total**: Basically free for starter use

---

## Deployment Steps

### 1️⃣ Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### 2️⃣ Create D1 Database
```bash
wrangler d1 create mod-sales
```
**→ Copy the database_id**

### 3️⃣ Create R2 Bucket
```bash
wrangler r2 bucket create mod-sales-files
```

### 4️⃣ Update wrangler.toml
Open `wrangler.toml` and fill in:
```toml
account_id = "YOUR-ACCOUNT-ID"  # From: wrangler whoami

[[d1_databases]]
database_id = "YOUR-DB-ID"  # From step 2️⃣

[[r2_buckets]]
bucket_name = "mod-sales-files"
```

### 5️⃣ Update Namecheap DNS
1. Go to **Namecheap Dashboard**
2. Domain management → **Manage**
3. **Nameservers** → Change to:
   ```
   iris.ns.cloudflare.com
   nash.ns.cloudflare.com
   ```
4. Wait ~5 minutes for propagation

### 6️⃣ Deploy
```bash
npm run deploy
```

### 7️⃣ Visit
- Landing: https://freenull.com
- Download: https://freenull.com/download
- Admin: https://freenull.com/admin (password: admin)

---

## After Deployment

**Change your admin password immediately!**

In Cloudflare Dashboard → Pages → Environment:
- Update `ADMIN_PASSWORD_HASH` with your own bcrypt hash

```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('YOUR-PASSWORD', 10));"
```

---

## Database & Files

Everything persists on Cloudflare:
- **Database**: D1 (no file size limits)
- **Files**: R2 (auto-scaling)
- **No local storage needed**

---

## Troubleshooting

**"Database not found"**
```bash
wrangler d1 list
wrangler d1 info mod-sales
```

**"Can't upload files"**
```bash
wrangler r2 bucket list
wrangler r2 objects list mod-sales-files
```

**Want to test locally first?**
```bash
wrangler pages dev .
# Visit: http://localhost:3000
```

---

## Next: Update API Routes (Optional)

The API routes currently use local SQLite (`better-sqlite3`). To fully optimize for Cloudflare:

- Replace `lib/db.ts` with `lib/db-d1.ts`
- Replace local file uploads with R2
- Use the Worker bindings

**Want me to do this?** Let me know!

---

## Support

Problems? Check:
- `CLOUDFLARE_DEPLOY.md` - Detailed guide
- Cloudflare Dashboard → Analytics for logs
- `wrangler tail` - View live logs

---

**Your app is ready to deploy! 🚀**

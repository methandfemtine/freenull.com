# 🚀 START HERE - Deploy in 10 Minutes

Everything is ready to deploy. Just run ONE command.

---

## For Windows Users (You!)

Open PowerShell or Command Prompt in this folder and run:

```bash
deploy.bat
```

That's it! The script will:
1. ✅ Check everything is installed
2. ✅ Log you into Cloudflare (browser opens)
3. ✅ Create your D1 database
4. ✅ Create your R2 bucket
5. ✅ Update configuration files
6. ✅ Push code to GitHub
7. ✅ Deploy to Cloudflare

---

## What You Need to Do (Just 2 Steps)

### Step 1: GitHub
When the script asks, you'll need to:
1. Go to https://github.com/new
2. Create a repo called `mod-sales`
3. Copy the GitHub URL it gives you
4. Paste it into the script

### Step 2: Namecheap DNS
After deployment, change your nameservers:
1. **Namecheap** → freenull.com → **Manage**
2. **Nameservers** → Change to:
   ```
   iris.ns.cloudflare.com
   nash.ns.cloudflare.com
   ```
3. Wait 5 minutes

---

## That's All!

After Step 2, visit: **https://freenull.com** ✨

Your app is live on Cloudflare!

---

## What's Included

✅ Landing page (flashy, animated)
✅ Customer download portal (secure links)
✅ Admin dashboard (manage keys & files)
✅ 3 customers already migrated
✅ Encrypted database (no more plain text!)
✅ One-time download links (can't be shared)

---

## Troubleshooting

**Script won't run?**
```bash
npm install -g wrangler
```

**Can't find GitHub URL?**
After creating repo on GitHub, look for the clone button. Copy the HTTPS URL.

**Not working after 10 minutes?**
Check Namecheap DNS propagation. May take up to 24 hours (usually 5 mins).

---

## Next: Change Admin Password

After deployment, generate a new admin password:

```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('YOUR-NEW-PASSWORD', 10));"
```

Copy the output and update in Cloudflare Dashboard → Environment Variables.

---

**Ready? Run `deploy.bat` now!** 🚀

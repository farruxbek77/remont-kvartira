# Netlify Deployment Guide

## Quick Deployment Steps

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Select your repository: `farruxbek77/remont-kvartira`
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `public`
   - **Branch to deploy:** `main`
6. Click "Deploy site"
7. Wait 1-2 minutes for deployment to complete
8. Your site will be live at: `https://[random-name].netlify.app`

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=public
```

## After Deployment

### Test Your Site

1. **Main Page:** `https://your-site.netlify.app/`
2. **Client Form:** `https://your-site.netlify.app/client.html`
3. **Admin Login:** `https://your-site.netlify.app/admin-login.html`
   - Username: `admin`
   - Password: `admin2013`

### Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

## Important Notes

### Data Storage

⚠️ This is a **static site** using **localStorage**:
- Data is stored in the browser only
- Data does NOT sync across devices
- Clearing browser data will delete all requests
- Each user sees only their own data

### For Production Use

If you need real backend functionality:
1. Consider using Netlify Functions
2. Or deploy backend separately (Render, Railway, etc.)
3. Or use a Backend-as-a-Service (Firebase, Supabase)

## Troubleshooting

### 404 Errors

If you get 404 errors, check:
- `netlify.toml` is in the root directory
- `public` folder contains all HTML files
- Redirects are configured correctly

### Admin Panel Not Working

- Make sure you're accessing `/admin-login.html` (with .html extension)
- Check browser console for errors
- Verify localStorage is enabled in browser

### Images Not Loading

- Ensure images are in the `public` folder
- Check image paths are relative (not absolute)
- Verify image files are committed to git

## Support

For issues or questions:
- Check Netlify deployment logs
- Review browser console for errors
- Contact: +998 91 977 62 25

---

✅ Your site is now live and ready to use!

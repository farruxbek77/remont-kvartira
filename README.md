# REMONT PRO - Renovation Service Website

Professional renovation service website with client request form and admin panel.

## Features

- 🏠 Modern landing page with animations
- 📝 Client request form
- 🔧 Admin panel for managing requests
- 🌐 Multi-language support (Uzbek, Russian, English)
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design

## Tech Stack

- HTML5, CSS3, JavaScript
- Static site (no backend required)
- LocalStorage for data persistence
- Netlify-ready deployment

## Deployment to Netlify

1. Push this repository to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `public`
6. Click "Deploy site"

## Admin Access

- URL: `/admin-login.html`
- Username: `admin`
- Password: `admin2013`

## Local Development

Since this is a static site, you can simply open `public/index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server public -p 8000
```

Then visit: `http://localhost:8000`

## Project Structure

```
├── public/
│   ├── index.html          # Main landing page
│   ├── client.html         # Client request form
│   ├── admin-login.html    # Admin login page
│   ├── admin.html          # Admin dashboard
│   ├── styles.css          # Main styles
│   ├── client-styles.css   # Client form styles
│   ├── admin-styles.css    # Admin panel styles
│   ├── script.js           # Main JavaScript
│   ├── client-script.js    # Client form logic
│   └── admin-script.js     # Admin panel logic
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies (for reference)
└── README.md               # This file
```

## Note

This is a static version that uses localStorage for data persistence. Data is stored locally in the browser and will not sync across devices. For production use with real backend, consider implementing a proper API with database.

## Contact

- Phone: +998 91 977 62 25
- Telegram: @ProFix_Renovatione

---

© 2024 REMONT PRO - Professional Renovation Services

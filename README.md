# Harsh Gohil — Portfolio Website

Apple-inspired 3D dark portfolio built with **Node.js, Express, HTML/CSS** — no frameworks.

## 🚀 Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

## 📁 Structure

```
portfolio/
├── server.js          # Express server (security, compression, routing)
├── routes/
│   ├── index.js       # Page routes
│   └── api.js         # Contact form API + health check
├── views/
│   └── index.html     # Main portfolio page
├── public/
│   ├── css/style.css  # All styles
│   ├── js/main.js     # Animations, canvas, form
│   ├── images/        # Photo assets
│   └── 404.html
```

## 🔒 Security Features

- **Helmet.js** — HTTP security headers (CSP, HSTS, XSS protection)
- **Rate limiting** — 200 req/15min global, 5 req/hr for contact form
- **Input sanitization** — strips HTML from form inputs
- **Compression** — gzip all responses
- **Payload limits** — 10kb max request body

## 🌐 Deploy to Production

**AWS EC2 + Nginx + PM2:**

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name "harsh-portfolio"
pm2 save
pm2 startup

# Nginx config (proxy to port 3000)
server {
    listen 80;
    server_name yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Environment Variables:**
```bash
PORT=3000   # Default
NODE_ENV=production
```

## ✉️ Contact Form

Currently logs to console. To send real emails, install nodemailer:

```bash
npm install nodemailer
```

Then update `routes/api.js` with your SMTP config.

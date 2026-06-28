# Deployment Guide

This document describes how to deploy the Venturizer application to production environments.

---

## 1. Database Deployment (PostgreSQL)

The application uses Prisma ORM with PostgreSQL. In production, a serverless or managed database like **Neon.tech** or **Supabase** is recommended.

1. **Create the Database:** Setup a new PostgreSQL instance on your provider.
2. **Retrieve Connection String:** Make sure to copy the connection URI (e.g. `postgresql://user:pass@host/db?sslmode=require`).
3. **Configure Environment:** Set this URL as the `DATABASE_URL` environment variable in your build pipeline.
4. **Push Schema:** In your deployment script or pipeline, run the Prisma migration:
   ```bash
   npx prisma migrate deploy
   ```

---

## 2. Backend Deployment (Node.js/Express)

The backend Express server can be deployed to platforms like **Render**, **Railway**, **Heroku**, or **AWS App Runner**.

### Steps for deploying to Render or Railway
1. **Repository Connection:** Connect your GitHub repository.
2. **Build Settings:**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js` or `npm start`
3. **Environment Variables:** Define the following variables:
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `PORT`: `4000` (or leave empty if the host assigns it automatically).
   - `CLIENT_URL`: The URL of your deployed React frontend (e.g., `https://venturizer.vercel.app`).
   - `DASHBOARD_SECRET`: A secure random string used to protect admin dashboard access.
   - `GEMINI_API_KEY`: Your production Google Gemini API key.
   - `NODE_ENV`: `production`

---

## 3. Frontend Deployment (React/Vite)

The frontend React application can be deployed to static hosting providers like **Vercel**, **Netlify**, or **Render Static Sites**.

### Steps for deploying to Vercel
1. **Configure build parameters:**
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
2. **Vite API URL Configuration:** 
   Verify that your client endpoints point to your production backend URL rather than `localhost:4000`. By default, the frontend is configured to call relative paths or dynamic API URLs based on the origin:
   - Make sure `frontend/src/api/client.js` resolves endpoints using `import.meta.env.VITE_API_URL` or fallback matching.
3. **Configure Redirects (Vercel/Netlify):**
   Vite builds a Single Page Application (SPA). To prevent HTTP 404 errors when reloading routes like `/dashboard`, add a routing configuration:
   - **Vercel (`vercel.json`):**
     ```json
     {
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ]
     }
     ```
   - **Netlify (`_redirects`):**
     ```text
     /*   /index.html   200
     ```

---

## 4. Production Considerations

- **SSL/HTTPS Required:** The Neon database and Gemini API calls require secure connections. Ensure both frontend and backend are served over HTTPS.
- **CORS Configuration:** Verify the backend's `CLIENT_URL` environment variable matches your frontend production domain exactly. Otherwise, browser API requests will be blocked by CORS policy.
- **API Rate Limits:** Production loads might exceed Gemini's free tier rate limits. Monitor API usage in the Google Cloud Console and set up caching or queuing if necessary.

---

## 5. Troubleshooting & Common Issues

### Issue: Admin Dashboard displays 404 on page reload
- **Cause:** SPA routing issue. The static host tries to find a file at `/dashboard` which does not exist.
- **Solution:** Add the rewrite rule matching the rules in Section 3 above to route all requests back to `/index.html`.

### Issue: Lead scoring details show empty bars
- **Cause:** Database migrations were not executed, or the `ScoreBreakdown` records were not created.
- **Solution:** Run `npx prisma migrate deploy` to ensure your database structure matches your local environment.

### Issue: Gemini validation fails continuously
- **Cause:** Invalid or missing `GEMINI_API_KEY` on the hosting provider's environment settings.
- **Solution:** Verify the key is saved without quotes or spaces in your server configuration panel, and restart the deployment.

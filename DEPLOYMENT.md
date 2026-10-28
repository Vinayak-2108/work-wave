# Deployment

MongoDB Atlas (database) → Render (`server/`) → Vercel (`client/`).
Do them in this order: Render needs the Atlas URI, Vercel needs the Render URL, and Render's CORS needs the Vercel URL.

## 0. Before you start

- **Roll the Stripe key.** An `sk_test_...` key was committed in `server/index.js` and is still in git history. Stripe Dashboard → Developers → API keys → *Roll key* on the secret key. Use the new one below.
- Push the repo (with these changes) to GitHub. Render and Vercel both deploy from it.
- Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## 1. MongoDB Atlas

1. Sign in at cloud.mongodb.com → **Create** a project (e.g. `workwave`).
2. **Build a Database** → **M0 (Free)** → pick a region close to your Render region → Create.
3. **Database Access** → Add New Database User → password auth. Save the username/password (avoid `@ : / ?` in the password, or URL-encode them).
4. **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`). Render's free tier has no static outbound IPs.
5. **Database** → Connect → **Drivers** → copy the `mongodb+srv://...` string. Fill in the password and add the DB name before the `?`:
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/workwave?retryWrites=true&w=majority`
6. (Optional) Put that in your local `server/.env` as `MONGO_URI` and run `npm run dev` in `server/` to confirm `DB Connected`.

## 2. Render (backend)

1. render.com → **New** → **Web Service** → connect the GitHub repo.
2. Settings:
   | Field | Value |
   |---|---|
   | Root Directory | `server` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free (or paid to avoid cold starts) |
3. **Environment Variables** (do *not* set `PORT`; Render provides it):
   | Key | Value |
   |---|---|
   | `MONGO_URI` | Atlas string from step 1 |
   | `JWT_SECRET` | the random string you generated |
   | `STRIPE_KEY` | the **rolled** Stripe secret key |
   | `CLIENT_URL` | `http://localhost:3000` for now; replace in step 4 |
   | `DOMAIN_URL` | `http://localhost:3000` for now; replace in step 4 |
4. **Advanced** → Health Check Path: `/health`.
5. Create the service. When it's live, open `https://<your-service>.onrender.com/health` and you should get `{"status":"ok","db":"connected"}`.
   - `db: "disconnected"` → check `MONGO_URI` and the Atlas Network Access rule; see the Render logs.
   - Free instances sleep after ~15 min idle; the first request after that takes ~30–60 s.

## 3. Vercel (frontend)

1. vercel.com → **Add New** → **Project** → import the same repo.
2. Settings:
   | Field | Value |
   |---|---|
   | Root Directory | `client` |
   | Framework Preset | Create React App |
   | Build Command | leave default; `client/vercel.json` sets `CI=false npm run build` |
   | Output Directory | `build` (default) |
3. **Environment Variables**:
   | Key | Value |
   |---|---|
   | `REACT_APP_API_URL` | `https://<your-service>.onrender.com` (no trailing slash) |
   | `REACT_APP_PAYPAL_CLIENT_ID` | your PayPal sandbox/live client ID |
4. Deploy. `client/vercel.json` rewrites all paths to `index.html`, so refreshing `/userdashboard` etc. works.
   - Vercel sets `CI=true`, which makes CRA treat the project's existing ESLint warnings as errors. `vercel.json` overrides this with `CI=false`; once the warnings are fixed you can drop that.
   - `REACT_APP_*` values are baked in at build time. Changing them requires a redeploy.

## 4. Connect the two

1. Copy the Vercel production URL, e.g. `https://workwave.vercel.app`.
2. In Render → Environment, set:
   - `CLIENT_URL=https://workwave.vercel.app` (comma-separate extra origins, e.g. a custom domain)
   - `DOMAIN_URL=https://workwave.vercel.app`
3. Save; Render redeploys automatically.
4. Open the Vercel site, sign up, log in, submit a request. In DevTools → Network, API calls should go to `onrender.com` with no CORS errors.

## Known limitations

- `server/routes/userRoutes.js` configures multer to write to `uploads/`, which doesn't exist in the repo, and Render's disk is wiped on every deploy. The client currently sends JSON (no files), so this isn't hit today. Real file uploads would need object storage (S3, Cloudinary, etc.).
- Vercel preview deployments get their own URLs and will be blocked by CORS unless you add them to `CLIENT_URL`.

# Cantara Welding & Fabrication — Website

Node/Express + SQLite site with a password-protected lead dashboard. Built by Real Easy Sites.

## Deploy (Render)
1. Push this folder to a new GitHub repo.
2. Render → New Web Service → connect repo. Build: `npm install` · Start: `npm start` (Node 20 pinned via `.node-version`).
3. Environment variables:
   - `ADMIN_PASSWORD` — required; dashboard login is disabled until it's set
   - `SESSION_SECRET` — any long random string
   - `NOTIFY_EMAIL` — where new quote requests get emailed (planned: josh_cantara@yahoo.com)
   - `SMTP_USER` / `SMTP_PASS` (+ optional `SMTP_HOST`, `SMTP_PORT`) — a Gmail app password works
   - `DATA_DIR` — optional; point at a Render persistent disk (e.g. `/var/data`) so leads survive redeploys
4. Dashboard: `/admin` (password only). Leads can be status-tracked, noted, and deleted.

## Photos & logo
See `public/images/README.txt` — drop photos in with the listed file names and they appear automatically.
Gallery captions live in `public/js/gallery-data.js`.
`logo.svg` / `og-logo.png` are placeholders until Josh's real logo is supplied.

## Domain
The client buys and owns the domain; point it at Render under Settings → Custom Domains.

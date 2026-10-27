const express = require('express');
const db = require('../db/database');
const { notifyNewQuote } = require('../lib/mailer');

const router = express.Router();

const clip = (v, n) => (v == null ? '' : String(v).trim().slice(0, n));

// Simple in-memory rate limit: 5 submissions / 10 min per IP
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

router.post('/', (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  if (rateLimited(req.ip)) return res.status(429).json({ error: 'Too many requests. Please call or text us instead.' });

  const q = {
    name: clip(b.name, 120),
    phone: clip(b.phone, 40),
    email: clip(b.email, 160),
    town: clip(b.town, 120),
    client_type: clip(b.client_type, 40),
    project_type: clip(b.project_type, 80),
    timeline: clip(b.timeline, 60),
    message: clip(b.message, 3000),
  };

  if (!q.name || !q.phone) return res.status(400).json({ error: 'Name and phone are required.' });

  const info = db.prepare(`INSERT INTO quotes (name, phone, email, town, client_type, project_type, timeline, message)
    VALUES (@name, @phone, @email, @town, @client_type, @project_type, @timeline, @message)`).run(q);

  q.id = info.lastInsertRowid;
  notifyNewQuote(q);
  res.json({ ok: true });
});

module.exports = router;

const path = require('path');
const express = require('express');
const db = require('../db/database');
const auth = require('../lib/auth');

const router = express.Router();
const views = path.join(__dirname, '..', 'views');
const STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

router.get('/login', (req, res) => {
  if (auth.isAuthed(req)) return res.redirect('/admin');
  res.sendFile(path.join(views, 'login.html'));
});

router.post('/login', (req, res) => {
  if (!auth.loginEnabled()) return res.redirect('/admin/login?error=disabled');
  if (!auth.checkPassword(req.body.password)) return res.redirect('/admin/login?error=1');
  auth.issueSession(res);
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  auth.clearSession(res);
  res.redirect('/admin/login');
});

router.use(auth.requireAuth);

router.get('/', (req, res) => res.sendFile(path.join(views, 'admin.html')));

router.get('/api/quotes', (req, res) => {
  res.json(db.prepare('SELECT * FROM quotes ORDER BY created_at DESC').all());
});

router.patch('/api/quotes/:id', (req, res) => {
  const { status, notes } = req.body || {};
  const row = db.prepare('SELECT id FROM quotes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  if (status !== undefined) {
    if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Bad status' });
    db.prepare('UPDATE quotes SET status = ? WHERE id = ?').run(status, req.params.id);
  }
  if (notes !== undefined) db.prepare('UPDATE quotes SET notes = ? WHERE id = ?').run(String(notes).slice(0, 3000), req.params.id);
  res.json({ ok: true });
});

router.delete('/api/quotes/:id', (req, res) => {
  const info = db.prepare('DELETE FROM quotes WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;

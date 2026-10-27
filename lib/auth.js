const crypto = require('crypto');

const COOKIE = 'cwf_admin';
const MAX_AGE_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) {
    crypto.timingSafeEqual(ba, ba); // keep timing roughly constant
    return false;
  }
  return crypto.timingSafeEqual(ba, bb);
}

function loginEnabled() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function checkPassword(pw) {
  if (!loginEnabled()) return false;
  return safeEqual(pw || '', process.env.ADMIN_PASSWORD);
}

function issueSession(res) {
  const expires = String(Date.now() + MAX_AGE_MS);
  res.cookie(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_MS,
  });
}

function clearSession(res) {
  res.clearCookie(COOKIE);
}

function isAuthed(req) {
  if (!loginEnabled()) return false;
  const raw = req.cookies && req.cookies[COOKIE];
  if (!raw || !raw.includes('.')) return false;
  const [expires, sig] = raw.split('.');
  if (!safeEqual(sig, sign(expires))) return false;
  return Number(expires) > Date.now();
}

function requireAuth(req, res, next) {
  if (isAuthed(req)) return next();
  if (req.path.startsWith('/api')) return res.status(401).json({ error: 'Not signed in' });
  return res.redirect('/admin/login');
}

module.exports = { checkPassword, issueSession, clearSession, isAuthed, requireAuth, loginEnabled };

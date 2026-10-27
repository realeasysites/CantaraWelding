const nodemailer = require('nodemailer');

let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

const esc = (s) => String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function notifyNewQuote(q) {
  if (!transporter || !process.env.NOTIFY_EMAIL) {
    console.log('[mailer] SMTP or NOTIFY_EMAIL not set — skipping email for quote', q.id);
    return;
  }
  const rows = [
    ['Name', q.name], ['Phone', q.phone], ['Email', q.email], ['Town', q.town],
    ['Residential / Commercial', q.client_type], ['Project', q.project_type],
    ['Timeline', q.timeline], ['Details', q.message],
  ].map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:bold;color:#555">${k}</td><td style="padding:6px 12px">${esc(v)}</td></tr>`).join('');

  try {
    await transporter.sendMail({
      from: `"Cantara Website" <${process.env.SMTP_USER}>`,
      to: process.env.NOTIFY_EMAIL,
      replyTo: q.email || undefined,
      subject: `New quote request: ${q.project_type || 'Project'} — ${q.name}`,
      html: `<h2 style="font-family:Arial">New quote request</h2><table style="font-family:Arial;font-size:14px;border-collapse:collapse">${rows}</table>`,
    });
  } catch (err) {
    console.error('[mailer] failed to send:', err.message);
  }
}

module.exports = { notifyNewQuote };

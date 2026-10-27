const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const quoteRoutes = require('./routes/quote');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Admin first so /admin always asks for the password before anything else.
app.use('/admin', adminRoutes);
app.use('/api/quote', quoteRoutes);

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.use((req, res) => res.status(404).sendFile(path.join(__dirname, 'public', '404.html')));

app.listen(PORT, () => console.log(`Cantara Welding & Fabrication running on port ${PORT}`));

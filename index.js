const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');

// .env configs
require('dotenv').config();

// Passport Config
require('./config/passport')(passport);

const { ensureAuth, ensureNonAuth, checkHeader } = require('./middleware/auth');
const { ensureEmail } = require('./middleware/email');

// Create Express Server
const app = express();

// Configuration
const PORT = process.env.PROX_PORT;
const API_SERVICE_URL = process.env.PROXY_BACKEND_URL;

// Logging Middleware
// app.use(morgan('dev'));
morgan.token('user', function (req, res) {
  if (req.user && req.user.email) {
    return `${req.user.level} ${req.user.email}`;
  }
  return '-';
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      "[PROX]",
      tokens.method(req, res),
      '[',
      tokens.user(req, res),
      ']',
      tokens.url(req, res),
      tokens.status(req, res),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.res(req, res, 'content-length'),
    ].join(' ');
  }),
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000, // 30 Minutes
    },
  }),
);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Login Endpoint
app.get(
  '/login',
  ensureNonAuth,
  passport.authenticate('google', {
    scope: ['email'],
  }),
);

// Logout Endpoint
app.get('/logout', ensureAuth, (req, res) => {
  req.logout();
  req.headers.authorization = '';
  res.redirect('/login');
});

// Oauth Callback Handler
app.get(
  '/auth/google',
  ensureNonAuth,
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/');
  },
);

// PING Endpoint
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Health Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: `OPERATIONAL`, message: 'SERVER OK' });
});

// Info GET endpoint
app.get('/info', ensureAuth, (req, res, next) => {
  res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

// Proxy endpoints
app.use(
  '/',
  ensureAuth,
  ensureEmail,
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    secure: false,
  }),
);

// Start the Proxy
app.listen(PORT, () => {
  console.log(`[PROX] Starting Proxy at ${PORT}`);
});

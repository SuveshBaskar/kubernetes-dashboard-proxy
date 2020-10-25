module.exports = {
  ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },
  ensureNonAuth(req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      return next();
    }
  },
  checkHeader(req, res, next) {
    if (!req.headers.authorization) {
      const email = req.user && req.user.email;
      return res.status(403).json({ error: `UNAUTHORISED ACCESS ${email || ''}` });
    }
    next();
  },
};

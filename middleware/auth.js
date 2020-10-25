module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  },
  ensureNonAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      return next();
    }
  },
  checkHeader: function (req, res, next) {
    if (!req.headers.authorization) {
      const email = req.user && req.user.email;
      return res.status(403).json({ error: `UNAUTHORISED ACCESS ${email || ''}` });
    }
    next();
  },
};

const emails = require('../config/email');

const getLevel = (inputEmail) => {
  let response = 'GUEST';

  Object.keys(emails).forEach((level) => {
    for (const email of emails[level]) {
      if (inputEmail === email) {
        response = level;
      }
    }
  });

  return response;
};

module.exports = {
  ensureEmail(req, res, next) {
    if (req.user && req.user.email) {
      req.user.level = getLevel(req.user.email);
      req.headers.authorization = process.env[`DASHBOARD_TOKEN_${req.user.level}`];
      next();
    } else {
      res.redirect('/login');
    }
  },
};

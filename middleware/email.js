const emails = require("../config/email")

const getLevel = (inputEmail) => {
  let response = "GUEST"
  for(let level in emails) {
    for(let email of emails[level]){
      if(inputEmail === email){
        response = level; break;
      }
    }
  }
  return response
}

module.exports = {
  ensureEmail: function (req, res, next) {
    if (req.user && req.user.email) {
      req.user.level = getLevel(req.user.email)
      req.headers['authorization'] = process.env[`DASHBOARD_TOKEN_${req.user.level}`]
      next()
    } else {
      res.redirect('/login');
    }
  }
};
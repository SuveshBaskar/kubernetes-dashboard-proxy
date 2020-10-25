const _ = require('lodash');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.AUTH_CLIENT_ID,
        clientSecret: process.env.AUTH_CLIENT_SECRET,
        callbackURL: '/auth/google',
      },
      (accessToken, refreshToken, profile, done) => {
        const email = _.get(profile, 'emails[0].value');
        done(null, { email });
      },
    ),
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};

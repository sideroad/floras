/*eslint no-underscore-dangle: ["error", { "allow": ["_json"] }]*/
import passport from 'passport';
import { Strategy } from 'passport-instagram';
import config from '../config';

export default {

  use: (app) => {
    // passport setup Strategy
    passport.serializeUser((user, cb) => {
      cb(null, user);
    });

    passport.deserializeUser((obj, cb) => {
      cb(null, obj);
    });

    passport.use(new Strategy({
      clientID: config.instagram.appId,
      clientSecret: config.instagram.secret,
      callbackURL: `${config.app.base}/auth/instagram/callback`,
    }, (accessToken, refreshToken, profile, cb) =>
      cb(null, { ...profile, token: accessToken })
    ));

    app.use(passport.initialize());
    app.use(passport.session());

    // Endpoint to confirm authentication is still in valid
    app.get('/auth',
      (req, res, next) => {
        if (req.isAuthenticated()) {
          return next();
        }
        return res.status(401).json({});
      }, (req, res) => {
        res.status(200).json({
          id: req.user.id,
          token: req.user.token
        });
      });

    app.get('/auth/instagram',
      passport.authenticate('instagram', { scope: ['basic', 'public_content'], session: true }));

    app.get('/auth/instagram/callback',
      passport.authenticate('instagram', { scope: ['basic', 'public_content'], session: true, failureRedirect: '/auth/instagram' }),
      (req, res) => {
        res.redirect(req.cookies.redirect || '/');
      });
  }
};

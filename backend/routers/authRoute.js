import express from 'express';
import passport from 'passport';

const router = express.Router();


router.post('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);



router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => { 
    res.redirect('/audience-builder');
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;

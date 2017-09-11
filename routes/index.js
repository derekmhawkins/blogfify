const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const User = require('../models').User;
const Career = require('../models').Career;
const Lifestyle = require('../models').Lifestyle;
const Travel = require('../models').Travel;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.route('/register')
  .get((req, res, next) => {
    res.render('register');
  })
  .post((req, res, next) => {
    if(req.body.password === req.body.password2) { // If 'password' and 'confirm password fields are the same'
      User.create(req.body)
        .then(user => {
          req.session.username = user;
          res.redirect('/');
        })
        .catch(error => {
          res.redirect('/register');
        });
    } else { // If they're not the same, throw an error
      const err = new Error("Password must match");
      return next(err);
    }
  });

router.route('/login')
  .get((req, res, next) => {
    res.render('login');
  })
  .post((req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if(!user) {
        var err = new Error("Invalid username or password");
        err.status = 401;
        return next(err);
      }
      req.logIn(user, err => {
        if(err) {
          return next(err);
        }
        req.session.username = user;
        res.redirect('/');
      });
    })(req, res, next);
  });

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/profile', (req, res, next) => {
  if(!req.session.username) {
    var err = new Error("You are not authorized to access this page");
    err.status = 403;
    return next(err);
  }
  res.render('profile');
});

router.get('/signout', (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/login');
  });
});

module.exports = router;

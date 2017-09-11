const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Travel = require('../models').Travel;
const _helpers = require('./_helpers');

/* GET travel route. */
router.route('/')
  .get((req, res, next) => {
    Travel.findAll().then((posts) => {
      res.render('travel/all', {
        posts: posts
      });
    });
  })
  .post(_helpers.upload.single('image'), (req, res, next) => {
    function imagePath() {
      return req.file.filename;
    }
    const userData = {
      title: req.body.title,
      image: imagePath(req.body.image),
      body: req.body.body
    };

    Travel.create(userData).then(post => {
      res.redirect(`/travel/${post.id}`);
    });
  });

router.get('/new', (req, res, next) => {
  res.render('travel/new');
});

router.route('/:id')
  .get((req, res, next) => {
    Travel.findById(req.params.id).then(post => {
      res.render('travel/single', {
        post: post
      });
    });
  })
  .put((req, res, next) => {
    Travel.findById(req.params.id).then(post => {
      return post.update(req.body);
    }).then(post => {
      res.redirect(`/travel/${req.params.id}`);
    });
  })
  .delete((req, res, next) => {
    Travel.findById(req.params.id).then(post => {
      return post.destroy(req.body);
    }).then(post => {
      res.redirect(`/travel`);
    });
  });

router.get('/:id/edit', (req, res, next) => {
  Travel.findById(req.params.id).then(post => {
    res.render('travel/edit', {
      post: post
    });
  });
});

module.exports = router;

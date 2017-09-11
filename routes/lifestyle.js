const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Lifestyle = require('../models').Lifestyle;
const _helpers = require('./_helpers');

/* GET lifestyle route. */
router.route('/')
  .get((req, res, next) => {
    Lifestyle.findAll().then((posts) => {
      res.render('lifestyle/all', {
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

    Lifestyle.create(userData).then(post => {
      res.redirect(`/lifestyle/${post.id}`);
    });
  });

router.get('/new', (req, res, next) => {
  res.render('lifestyle/new');
});

router.route('/:id')
  .get((req, res, next) => {
    Lifestyle.findById(req.params.id).then(post => {
      res.render('lifestyle/single', {
        post: post
      });
    });
  })
  .put((req, res, next) => {
    Lifestyle.findById(req.params.id).then(post => {
      return post.update(req.body);
    }).then(post => {
      res.redirect(`/lifestyle/${req.params.id}`);
    });
  })
  .delete((req, res, next) => {
    Lifestyle.findById(req.params.id).then(post => {
      return post.destroy(req.body);
    }).then(post => {
      res.redirect('/lifestyle');
    });
  });

router.get('/:id/edit', (req, res, next) => {
  Lifestyle.findById(req.params.id).then(post => {
    res.render('lifestyle/edit', {
      post: post
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Career = require('../models').Career;
const multer = require('multer');
const _helpers = require('./_helpers');

/* GET career route. */
router.route('/')
  .get((req, res, next) => {
    Career.findAll().then(posts => {
      res.render('career/all', {
        posts: posts
      });
    });
  })
  .post(_helpers.upload.single('image'), (req, res, next) => {
    console.log(req.body);
    console.log(req.file);

    function imagePath() {
      return req.file.filename;
    }
    const userData = {
      title: req.body.title,
      image: imagePath(req.body.image),
      body: req.body.body
    };
    Career.create(userData).then(post => {
      res.redirect(`/career/${post.id}`);
    });
  });

router.get('/new', (req, res, next) => {
  res.render('career/new');
});

router.route('/:id')
  .get((req, res, next) => {
    Career.findById(req.params.id).then(post => {
      res.render('career/single', {
        post: post
      });
    });
  })
  .put((req, res, next) => {
    Career.findById(req.params.id).then(post => {
      return post.update(req.body);
    }).then(post => {
      res.redirect(`/career/${req.params.id}`);
    });
  })
  .delete((req, res, next) => {
    Career.findById(req.params.id).then(post => {
      return post.destroy(req.body);
    }).then(post => {
      res.redirect('/career');
    });
  });

router.get('/:id/edit', (req, res, next) => {
  Career.findById(req.params.id).then((post) => {
    res.render('career/edit', {
      post: post
    });
  });
});

module.exports = router;

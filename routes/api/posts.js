const express = require("express");

const mongoose = require("mongoose");

const passport = require("passport");

const router = express.Router();

const Post = require("../../models/Post");

const ValidatePostInput = require("../../validation/post");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidatePostInput(req.body);

    if (!isValid) res.status(400).send(errors);
    const newPost = new Post({
      text: req.body.text,
      user: req.user._id,
      name: req.body.name,
      avatar: req.body.avatar
    });

    newPost
      .save()
      .then(post => res.json(post))
      .catch(err => res.json(err));
  }
);

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.send(err));
});

router.get("/:post_id", (req, res) => {
  Post.findOne({ _id: req.params.post_id })
    .then(post => res.json(posts))
    .catch(err => res.send(err));
});

router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (post.user.toString() == req.user._id) {
          post.delete();
          return res.json({
            success: true,
            message: "Post successfully deleted"
          });
        } else {
          return res.json({
            success: false,
            message: "You dont have permission to delete this post"
          });
        }
      })
      .catch(err =>
        res.json({
          success: false,
          message: "Post doesnt exist"
        })
      );
  }
);

router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (post.likes.length > 0) {
          post.likes.forEach(element => {
            do {
              {
                return res
                  .status(400)
                  .json({ alreadyliked: "You have already like this post" });
              }
            } while (element.user.toString() === req.user._id);
          });
        }
        post.likes.unshift({ user: req.user._id });
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (post.likes.length > 0) {
          post.likes.forEach(like => {
            do {
              post.splice(like, 1).then(res.json(post));
            } while (like.user.toString() === req.user._id);
          });
        }
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;

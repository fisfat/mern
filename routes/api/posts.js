const express = require("express");

const mongoose = require("mongoose");

const passport = require("passport");

const router = express.Router();

const Post = require("../../models/Post");

const ValidatePostInput = require("../../validation/post");

const ValidateCommentInput = require("../../validation/comment");

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
        const decide = { like: false, unlike: false };
        if (post.likes.length > 0) {
          post.likes.forEach(element => {
            if (element.user.toString() == req.user._id) {
              decide.unlike = true;
              post.likes.splice(element, 1);
              post.save().then(post => res.json(post));
            } else {
              decide.like = true;
            }
          });
        } else {
          post.likes.unshift({ user: req.user._id });
          post.save().then(post => res.json(post));
        }

        if (decide.like == true) {
          post.likes.unshift({ user: req.user._id });
          post.save().then(post => res.json(post));
        }
      })
      .catch(err => res.json(err));
  }
);

router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id).then(post => {
      const { errors, isValid } = ValidateCommentInput(req.body);
      if (!isValid) return res.status(400).json(errors);
      const comments = {
        text: req.body.text,
        user: req.body.id,
        name: req.body.name,
        avatar: req.body.avatar
      };
      post.comments.unshift(comments);
      post.save().then(post => res.json(post));
    });
  }
);

router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(400)
            .json({ commentnotexist: "Comment does not exist" });
        }
        const removeIndex = post.comments
          .map(comment => comment._id)
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.json(err));
  }
);

// router.post(
//   "/unlike/:post_id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     Post.findById(req.params.post_id)
//       .then(post => {
//         if (post.likes.length > 0) {
//           post.likes.forEach(like => {
//             do {
//               post.splice(like, 2).then(res.json(post));
//             } while (like.user.toString() === req.user._id);
//           });
//         }
//       })
//       .catch(err => res.json(err));
//   }
// );

module.exports = router;

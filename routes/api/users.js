const express = require("express");

const gravatar = require("gravatar");

const bcrypt = require("bcryptjs");

const passport = require("passport");

const secret = require("../../config/keys").secret;

const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../../models/User");

const validateRegisterInput = require("../../");

router.post("/register", (req, res) => {
  const query = { email: req.body.email };
  User.findOne(query).then(user => {
    if (user) {
      return res.status(400).json({ email: "The email is already in use" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) return res.json({ err });
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) return res.status(400).json({ err: "User not found" });

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(payload, secret, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
        // return res.json({ success: "success" });
      } else return res.status(401).json({ password: "password doesnt match" });
    });
  });
});

module.exports = router;

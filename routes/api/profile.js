const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const passport = require("passport");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const ValidateProfileInput = require("../../validation/profile");

const ValidateExperienceInput = require("../../validation/experience");

const ValidateEducationInput = require("../../validation/education");

router.get("/test", (req, res) => res.send("hi"));

router.get("/handle/:handle", (req, res) => {
  errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "There is no user with this handle";
        res.status(404).send(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

router.get("/user/:user_id", (req, res) => {
  errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.profile = "User not found";
        res.status(404).send(errors);
      }
      return res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

router.get("/all", (req, res) => {
  const errrors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.profile = "No user profile found";
        res.status(404).send(errors);
      }
      return res.json(profiles);
    })
    .catch(err => res.json(err));
});

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    errors = {};
    Profile.findOne({ user: req.user._id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "This user has no profile";
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
  }
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const errors = {};
    profileFields = {};
    const { errors, isValid } = ValidateProfileInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.clocation;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.github) profileFields.github = req.body.github;
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    profileFields.socials = {};
    if (req.body.youtube) profileFields.socials.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.socials.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.socials.facebook = req.body.facebook;
    if (req.body.instagram)
      profileFields.socials.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.socials.twitter = req.body.twitter;
    Profile.findOne({ user: req.user._id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (profile) {
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => {
            res.json(profile);
          });
        } else {
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = "This handle already eists";
              return res.status(400).json(errors);
            }
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
        }
      });
  }
);

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user._id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = ValidateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user._id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user._id })
      .then(profile => {
        const removeByIndex = profile.experience.map(item => item._id);
        profile.experience.splice(removeByIndex, 1);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user._id })
      .then(profile => {
        const removeByIndex = profile.education.map(item => item._id);
        profile.education.splice(removeByIndex, 1);
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.json(err));
  }
);

module.exports = router;

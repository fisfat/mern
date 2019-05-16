const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  var errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";
  data.website = !isEmpty(data.website) ? data.website : "";
  data.youtube = !isEmpty(data.youtube) ? data.youtube : "";
  data.instagram = !isEmpty(data.instagram) ? data.instagram : "";
  data.twitter = !isEmpty(data.twitter) ? data.twitter : "";
  data.facebook = !isEmpty(data.facebook) ? data.facebook : "";
  data.linkedin = !isEmpty(data.linkedin) ? data.linkedin : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 20 })) {
    errors.handle = "Handles should be between 2 and 20 characters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Handle is required";
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = "Profile status is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Profile skills is required";
  }

  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = "The website field must be a valid URL";
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "This field must be a valid URL";
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "This field must be a valid URL";
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "This field must be a valid URL";
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "This field must be a valid URL";
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "This field must be a valid URL";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

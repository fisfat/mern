const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  var errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // if (Validator.isEmpty(data.name)) {
  //   errors.name = "The name field is required";
  // }

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "The name field has to be between 2 & 30 characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "This field requires a valid email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "The email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "The password field is required";
  }

  // if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
  //   errors.password = "The Password field has to be between 8 & 30 characters";
  // }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "The confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "The password fields must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

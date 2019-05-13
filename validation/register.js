const Validator = require("validator");
import isEmpty from "./is-empty";

module.exports = function validateRegisterInput(data) {
  var errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "The name field has to be between 2 & 30 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

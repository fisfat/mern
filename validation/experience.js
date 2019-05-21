const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  var errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  //   data.location = !isEmpty(data.location) ? data.location : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  //   data.to = !isEmpty(data.to) ? data.to : "";
  //   data.current = !isEmpty(data.current) ? data.current : "";
  //   data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "The title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "The company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "The from field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

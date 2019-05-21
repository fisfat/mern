const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  var errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  //   data.location = !isEmpty(data.location) ? data.location : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  //   data.to = !isEmpty(data.to) ? data.to : "";
  //   data.current = !isEmpty(data.current) ? data.current : "";
  //   data.description = !isEmpty(data.description) ? data.description : "";

  if (Validator.isEmpty(data.school)) {
    errors.school = "The school field is required";
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = "The degree field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "The from field is required";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "The field of study field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

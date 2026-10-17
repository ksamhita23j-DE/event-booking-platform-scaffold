const { validationResult } = require("express-validator");

// Runs after express-validator's `body(...)` checks on a route; turns
// validation failures into a clean 400 response instead of letting bad
// data reach the controller/database.
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = validate;

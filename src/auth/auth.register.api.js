const httpError = require("http-errors");
const authService = require("./auth.service");
const paramsValidator = require("../middlewares/params-validator");
const buildApiHandler = require("../api-utils/build-api-handler");

async function controller(req, res) {
  const { username, password } = req.body;

  await authService.register(username, password);

  res.json({
    success: true,
    data: username,
  });
}

function validateParams(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    throw new httpError.BadRequest("Username and Password should be text only");
  }

  if (username.length < 8) {
    throw new httpError.BadRequest("Username must be atleast 8 characters");
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler(controller, [
  missingParamsValidator,
  validateParams,
]);

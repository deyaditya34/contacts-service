const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");
const userResolver = require("../middlewares/user-resolver");
const { createContactForUser } = require("./contacts.service");

async function controller(req, res) {
  let { name, phone, isFavorite, user } = req.body;

  if (!isFavorite) {
    isFavorite = false;
  }

  const result = await createContactForUser({ name, phone, isFavorite }, user);

  res.json({
    success: result.acknowledged,
    data: {
      contact: {
        _id: result.insertedId,
      },
    },
  });
}

function validateParams(req, res, next) {
  const errorTypedFields = ["name", "phone"].filter(
    (field) => typeof Reflect.get(req.body, field) !== "string"
  );
  if (errorTypedFields.length > 0) {
    throw httpError.BadRequest(
      `Fields '${errorTypedFields.join(",")}' should be of string type`
    );
  }

  const { name, phone, isFavorite } = req.body;
  if (name.length > 30) {
    throw httpError.BadRequest(`Name '${name}' is invalid`);
  }

  const PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX = /^\d{10}$/;
  if (!PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX.test(phone)) {
    throw httpError.BadRequest(`Phone number '${phone}' is invalid`);
  }

  if (Reflect.has(req.body, "isFavorite")) {
    if (typeof Reflect.get(req.body, "isFavorite") !== "boolean") {
      throw httpError.BadRequest(`isFavorite request should be of boolean type`);
    }
    // if (isFavorite !== true && isFavorite !== false) {
    //   throw httpError.BadRequest(
    //     `Favorite status - '${isFavorite}' is invalid. It should either be true or false`
    //   );
    // }
  }
  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["name", "phone"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler(controller, [
  userResolver,
  missingParamsValidator,
  validateParams,
]);

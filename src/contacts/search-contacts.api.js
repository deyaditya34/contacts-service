const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler.js");
const userResolver = require("../middlewares/user-resolver.js");
const { searchContactsForUser } = require("./contacts.service.js");
const { createParamValidator } = require("../middlewares/params-validator.js");

async function controller(req, res) {
  const { filter, user } = req.body;

  const result = await searchContactsForUser(filter, user);
  console.log("Result is", result);

  if (result.length === 0) {
    res.json({
      message: "No contacts found",
    });
  } else {
    res.json({
      message: "Contact Found",
      data: {
        contacts: result,
      },
    });
  }
}

function validateParams(req, res, next) {
  const { name, phone, isFavorite } = req.body.filter;
  if (name) {
    if (typeof name !== "string") {
      throw httpError.BadRequest(`'${name}' field should be of string type`);
    }
    if (name.length > 30) {
      throw httpError.BadRequest(`Name '${name}' is invalid`);
    }
  }
  if (phone) {
    if (typeof phone !== "string") {
      throw httpError.BadRequest(`'${phone} field should be of string type`);
    }
    const PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX = /^\d{10}$/;
    if (!PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX.test(phone)) {
      throw httpError.BadRequest(`Phone number '${phone}' is invalid`);
    }
  }
  if (Reflect.has(req.body.filter, "isFavorite")) {
    if (typeof isFavorite !== "boolean") {
      throw httpError.BadRequest(
        `'${isFavorite}' field should be of boolean type`
      );
    }
  }

  const filter = req.body.filter;

  const parsedFilter = {};

  if (filter.name) {
    parsedFilter.name = filter.name;
  }

  if (filter.phone) {
    parsedFilter.phone = filter.phone;
  }

  if (Reflect.has(req.body.filter, "isFavorite")) {
    parsedFilter.isFavorite = filter.isFavorite;
  }

  if (
    !parsedFilter.name &&
    !parsedFilter.phone &&
    parsedFilter.isFavorite !== true &&
    parsedFilter.isFavorite !== false
  ) {
    throw httpError.BadRequest(
      "Atleast 'name', 'phone' or 'isFavorite' must be provided in filter"
    );
  }

  Reflect.set(req.body, "filter", parsedFilter);
  req.body.filter = parsedFilter;
  next();
}

const missingParamsValidator = createParamValidator(["filter"], "body");

module.exports = buildApiHandler(controller, [
  userResolver,
  missingParamsValidator,
  validateParams,
]);

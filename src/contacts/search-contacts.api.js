const createHttpError = require("http-errors");
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
  const filter = req.body.filter;

  const parsedFilter = {};

  if (filter.name) {
    parsedFilter.name = filter.name;
  }

  if (filter.phone) {
    parsedFilter.phone = filter.phone;
  }

  // if (filter.id) {
  //   parsedFilter.id = filter.id;
  // }
 
  if (!parsedFilter.name && !parsedFilter.phone && !parsedFilter.id) {
    throw createHttpError.BadRequest(
      "Atleast 'name', 'phone' or 'id must be provided in filter"
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

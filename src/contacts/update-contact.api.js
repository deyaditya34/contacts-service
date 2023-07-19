const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler.js");
const userResolver = require("../middlewares/user-resolver.js");
const { updateContactForUser } = require("./contacts.service.js");
const { createParamValidator } = require("../middlewares/params-validator.js");

async function controller(req, res) {
  const { id, update, user } = req.body;

  const result = await updateContactForUser(id, update, user);
  console.log(result);

  if (!result.modifiedCount) {
    res.json({
      message: "No contact available to update",
    });
  } else {
    res.json({
      message: "Contact updated",
      data: {
        contacts: result,
      },
    });
  }
}

function validateParams(req, res, next) {
  const { name, phone, isFavorite } = req.body.update;
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
  if (isFavorite) {
    if (typeof isFavorite !== "string") {
      throw httpError.BadRequest(`'${isFavorite}' field should be of string type`);
    }
    if (isFavorite !== "true" && isFavorite !== "false") {
      throw httpError.BadRequest(
        `Favorite status - '${isFavorite}' is invalid. It should either be true or false`
      );
    }
  }

  const updateContact = req.body.update;

  const parsedUpdate = {};

  if (updateContact.name) {
    parsedUpdate.name = updateContact.name;
  }

  if (updateContact.phone) {
    parsedUpdate.phone = updateContact.phone;
  }

  if (updateContact.isFavorite) {
    parsedUpdate.isFavorite = updateContact.isFavorite;
  }

  if (!parsedUpdate.name && !parsedUpdate.phone && !parsedUpdate.isFavorite) {
    throw createHttpError.BadRequest(
      "Atleast 'name', 'phone' or 'isFavorite' must be provided in 'update'"
    );
  }

  Reflect.set(req.body, "update", parsedUpdate);
  next();
}

const missingParamsValidator = createParamValidator(["update", "id"], "body");

module.exports = buildApiHandler(controller, [
  userResolver,
  missingParamsValidator,
  validateParams,
]);

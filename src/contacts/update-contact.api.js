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
  const reqTypeValidator = Object.keys(req.body.update);

  const errorTypedFields = reqTypeValidator.filter(
    (field) => typeof Reflect.get(req.body.update, field) !== "string"
  );

  if (errorTypedFields.length > 0) {
    throw httpError.BadRequest(
      `Fields '${errorTypedFields.join(",")}' should be of string type`
    );
  }

  const { name, phone, isFav } = req.body.update;
  if (name) {
    if (name.length > 30) {
      throw httpError.BadRequest(`Name '${name}' is invalid`);
    }
  }
  if (phone) {
    const PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX = /^\d{10}$/;
    if (!PHONE_NUM_WITHOUT_COUNTRY_CODE_REGEX.test(phone)) {
      throw httpError.BadRequest(`Phone number '${phone}' is invalid`);
    }
  }
  if (isFav) {
    if (isFav !== "true" && isFav !== "false") {
      throw httpError.BadRequest(
        `Favorite status - '${isFav}' is invalid. It should either be true or false`
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

  if (updateContact.isFav) {
    parsedUpdate.isFav = updateContact.isFav;
  }

  if (!parsedUpdate.name && !parsedUpdate.phone && !parsedUpdate.isFav) {
    throw createHttpError.BadRequest(
      "Atleast 'name', 'phone' or 'isFav' must be provided in 'update'"
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
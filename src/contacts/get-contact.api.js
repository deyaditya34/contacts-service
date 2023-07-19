const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler.js");
const userResolver = require("../middlewares/user-resolver.js");
const { getContactForUser } = require("./contacts.service.js");

async function controller(req, res) {
  const { id, user } = req.body;

  const result = await getContactForUser(id, user);
  console.log("Result is", result);

  if (!result) {
    res.json({
      message: `No contact found for the id '${id}'`,
    });
  } else {
    res.json({
      message: "Contact found",
      data: result,
    });
  }
}

module.exports = buildApiHandler(controller, [userResolver]);

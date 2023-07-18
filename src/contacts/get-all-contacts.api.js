const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const { getAllContactsForUser } = require("./contacts.service");

async function controller(req, res) {
  const { user } = req.body;
  const allContacts = await getAllContactsForUser(user);

  res.json({
    success: true,
    data: allContacts,
  });
}

module.exports = buildApiHandler(controller, [userResolver]);

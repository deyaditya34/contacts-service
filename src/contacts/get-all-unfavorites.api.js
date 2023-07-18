const { getAllUnfavoritesForUser } = require("./contacts.service");
const buildApiHandler = require("../api-utils/build-api-handler.js");
const userResolver = require("../middlewares/user-resolver");

async function controller(user) {
  // const { user } = req.body;

  const result = await getAllUnfavoritesForUser(user);

  if (result.length === 0) {
    res.json({
      message: `No unfavorite contacts added for the user '${user.username}'`,
    });
  } else {
    res.json({
      message: `unfavorites Contacts for the user '${user.username}`,
      data: result,
    });
  }
}

module.exports = buildApiHandler(controller, [userResolver]);

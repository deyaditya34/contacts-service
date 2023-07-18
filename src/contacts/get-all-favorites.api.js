const { getAllFavoritesForUser } = require("./contacts.service");
const buildApiHandler = require("../api-utils/build-api-handler.js");
const userResolver = require("../middlewares/user-resolver");

async function controller(req, res) {
  const { user } = req.body;

  const result = await getAllFavoritesForUser(user);

  if (result.length === 0) {
    res.json({
      message: `No favorite contacts added for the user '${user.username}'`,
    });
  } else {
    res.json({
      message: `Favorites Contacts for the user '${user.username}`,
      data: result,
    });
  }
}

module.exports = buildApiHandler(controller, [userResolver]);

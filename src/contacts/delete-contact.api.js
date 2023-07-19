const deleteContactForUser = require("./contacts.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");

async function controller(req, res) {
    const {id, user} = req.body;

    const result = await deleteContactForUser(id, user);
    console.log(result);
    
    res.json({
        success: true,
        data: result,
    })
}


module.exports = buildApiHandler(controller, [userResolver])
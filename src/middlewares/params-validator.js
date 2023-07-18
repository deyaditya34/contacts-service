const httpError = require("http-errors");

/**
 * Create a Express handler middleware to check the presence of fields in request
 * @param {string[]} params list of fields to check presence for
 * @param {"body" | "query"} paramKey the field in `request` where the params are required
 * @returns Express handler middleware which will check presence of required fields
 * @throws The Express middleware will throw HTTP Bad request if any of the mentioned fields are not present
 */
const createParamValidator = (params, paramKey) => (req, res, next) => {
  const reqParams = Reflect.get(req, paramKey);
  
  const missingParams = params.filter(
    (param) => !Reflect.has(reqParams, param)
  );
  
  if (missingParams.length > 0) {
    throw httpError.BadRequest(
      `Required fields '${missingParams.join(
        ","
      )}' are missing from '${paramKey}'`
    );
  }

  next();
};

const PARAM_KEY = {
  BODY: "body",
  QUERY: "query",
};

module.exports = {
  createParamValidator,
  PARAM_KEY,
};

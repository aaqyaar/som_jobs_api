const z = require("zod");

/**
 * ValidationMiddleware is a class to handle validation middleware
 * @param req Request
 * @param res Response
 * @param next NextFunction
 * @returns
 * @throws BadRequestException
 */
class ValidationMiddleware {
  static validate = (schema) => async (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        return res.status(400).json({
          status: "error",
          message: "Invalid request data",
          errors,
        });
      }

      return res.status(400).json({
        message: error?.message || error.toString() || "Invalid request data",
        status: "error",
      });
    }
  };
}

module.exports = {
  ValidationMiddleware,
};

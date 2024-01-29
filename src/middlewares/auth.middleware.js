const { User } = require("../models/user.model");
const { verifyToken } = require("../utils/helpers");

class AuthMiddleware {
  static protect = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, We are not accepting this type of token",
        });
      }

      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, Token is not exist",
        });
      }
      const decoded = await verifyToken({ token });

      if (!decoded) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, Token is not valid",
        });
      }

      // Check if user exists and active
      const user = await User.findOne({
        _id: decoded._id,
        status: "ACTIVE",
      });

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, this user does not exist or it's not active",
        });
      }

      req.user = {
        ...user.toObject(),
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
  };

  /**
   * This method checks if the user has permission to access a resource
   * @param {*} requiredRoles
   * @returns {Function} middleware
   * @memberof AuthMiddleware
   */
  static authorize = (requiredRoles) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res
            .status(401)
            .json({ status: "error", message: "Unauthorized" });
        }

        const userRole =
          req.user.role ||
          (
            await User.findOne({
              _id: req.user.id,
            })
          ).toObject().role;

        if (!userRole) {
          return res
            .status(401)
            .json({ status: "error", message: "Unauthorized" });
        }

        const hasPermission = requiredRoles.includes(userRole);

        if (hasPermission) {
          return next();
        }

        return res.status(403).json({
          status: "error",
          message:
            "Forbidden, You don't have permission to access this resource",
        });
      } catch (error) {
        return res.status(403).json({
          status: "error",
          message:
            "Forbidden, You don't have permission to access this resource",
        });
      }
    };
  };
}

module.exports = AuthMiddleware;

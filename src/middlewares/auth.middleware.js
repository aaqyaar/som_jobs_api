const { Permission } = require("../models/role.model");
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
      }).populate("roles");

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized, this user does not exist or it's not active",
        });
      }

      req.user = {
        ...user.toObject(),
        roles: user.roles.map((role) => role._id),
      };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }
  };

  /**
   * This method checks if the user has permission to access a resource
   * @param {*} action
   * @param {*} subject
   * @returns {Function} middleware
   * @memberof AuthMiddleware
   */
  static authorize = (action, subject) => {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          return res
            .status(401)
            .json({ status: "error", message: "Unauthorized" });
        }

        const userRoles =
          req.user.roles ||
          (
            await User.findOne({
              _id: req.user.id,
            }).populate("roles")
          )
            .toObject()
            .roles.map((role) => role._id);

        const permissionChecks = await Promise.all(
          userRoles?.length > 0 &&
            userRoles?.map(async (role) => {
              const permissions = await Permission.find({
                role,
                action,
                subject,
              });

              return permissions.length > 0;
            })
        );

        if (permissionChecks.some((hasPermission) => hasPermission)) {
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

const RoleController = require("./role.controller");
const AuthController = require("./auth.controller");

module.exports = {
  ...RoleController,
  ...AuthController,
};

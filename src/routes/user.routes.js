const router = require("express").Router();

const {
  getUser,
  getUsers,
  updateUser,
} = require("../controllers/user.controller");

const AuthMiddleware = require("../middlewares/auth.middleware");

function loadRoutes(basePath = "/users") {
  router.get(`${basePath}`, AuthMiddleware.protect, getUsers);
  router.get(`${basePath}/:id`, getUser);

  router.patch(`${basePath}/:id`, updateUser);
}

loadRoutes();

module.exports = router;

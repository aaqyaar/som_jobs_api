const router = require("express").Router();

const { getUser, getUsers } = require("../controllers/user.controller");
const {
  getRoles,
  createRole,
  getPermissions,
  createPermission,
  createPermissions,
  login,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controllers/auth");
const {
  ValidationMiddleware,
} = require("../middlewares/validation.middleware");
const {
  roleSchema,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  permissionsSchema,
} = require("../validations/auth.validation");
const AuthMiddleware = require("../middlewares/auth.middleware");

function loadRoutes(basePath = "/auth") {
  router.post(
    `${basePath}/login`,
    ValidationMiddleware.validate(loginSchema),
    login
  );
  router.post(
    `${basePath}/register`,
    ValidationMiddleware.validate(registerSchema),
    register
  );
  router.post(
    `${basePath}/refresh-token`,
    ValidationMiddleware.validate(refreshTokenSchema),
    refreshToken
  );
  router.post(
    `${basePath}/forgot-password`,
    ValidationMiddleware.validate(forgotPasswordSchema),
    forgotPassword
  );
  router.post(
    `${basePath}/reset-password`,
    ValidationMiddleware.validate(resetPasswordSchema),
    resetPassword
  );

  router.post(`${basePath}/logout`, logout);

  router.get(
    "/users",
    AuthMiddleware.protect,
    AuthMiddleware.authorize("READ", "User"),
    getUsers
  );
  router.get("/users/:id", getUser);

  router.get(`${basePath}/roles`, getRoles);
  router.post(
    `${basePath}/roles`,
    ValidationMiddleware.validate(roleSchema),
    createRole
  );

  router.get(`${basePath}/permissions`, AuthMiddleware.protect, getPermissions);
  router.post(
    `${basePath}/permissions`,
    AuthMiddleware.protect,
    ValidationMiddleware.validate(permissionsSchema),
    createPermission
  );
  router.post(
    `${basePath}/permissions/bulk`,
    AuthMiddleware.protect,
    ValidationMiddleware.validate(permissionsSchema),
    createPermissions
  );
}

loadRoutes();

module.exports = router;

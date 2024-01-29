const router = require("express").Router();

const {
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
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validations/auth.validation");

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
}

loadRoutes();

module.exports = router;

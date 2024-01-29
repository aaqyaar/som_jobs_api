const router = require("express").Router();
const {
  getJobs,
  createJob,
  createJobs,
  updateJob,
  deleteJob,
} = require("../controllers/job.controller");
const {
  ValidationMiddleware,
} = require("../middlewares/validation.middleware");
const AuthMiddleware = require("../middlewares/auth.middleware");
const { jobSchema, bulkJobSchema } = require("../validations/job.validation");

function loadRoutes(basePath = "/jobs") {
  router.get(`${basePath}`, AuthMiddleware.protect, getJobs);
  router.post(
    `${basePath}`,
    ValidationMiddleware.validate(jobSchema),
    AuthMiddleware.protect,
    AuthMiddleware.authorize(["ADMIN"]),
    createJob
  );
  router.post(
    `${basePath}/bulk`,
    AuthMiddleware.protect,
    AuthMiddleware.authorize(["ADMIN"]),
    ValidationMiddleware.validate(bulkJobSchema),
    createJobs
  );
  router.put(
    `${basePath}/:id`,
    AuthMiddleware.protect,
    AuthMiddleware.authorize(["ADMIN"]),
    ValidationMiddleware.validate(jobSchema),
    updateJob
  );

  router.delete(`${basePath}/:id`, AuthMiddleware.protect, deleteJob);
}

loadRoutes();

module.exports = router;

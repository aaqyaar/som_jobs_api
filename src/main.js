const { readdirSync } = require("fs");
const { join } = require("path");
const express = require("express");
const cors = require("cors");
const colors = require("colors");
const { env } = require("./config/env");
const logger = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const { connectDB } = require("./providers/database");

connectDB();
/**
 * This function is the main function.
 * @returns {void}
 */
async function main() {
  const app = express();

  // Enable CORS
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Enable Cookie Parser
  app.use(cookieParser());

  // Set security headers
  app.use(helmet());

  // Log requests to the console
  if (process.env.NODE_ENV !== "production") {
    app.use(logger("dev"));
  }

  /**
   * This block of code loads all routes.
   * @description Means dynamic import of all routes.
   */
  const routesPath = join(__dirname, "routes");
  const routes = readdirSync(routesPath);
  routes.forEach((file) => {
    const route = require(join(routesPath, file));
    app.use("/api", route);
  });

  const port = env().port;

  app.listen(port, () => {
    console.log(
      `${colors.green("✓")} ${colors.blue(`Server listening on port ${port}`)}`
    );
  });
}

main();

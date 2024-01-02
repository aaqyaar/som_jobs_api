const mongoose = require("mongoose");
const { env } = require("../config/env");
const colors = require("colors");

exports.connectDB = async (databaseUrl = env().databaseUrl) => {
  try {
    const conn = await mongoose.connect(databaseUrl);
    console.log(
      `${colors.green("✓")} ${colors.bold(
        "Database connected successfully"
      )} ${colors.blue(conn.connection.host)}`
    );
  } catch (error) {
    console.log(
      `${colors.red("✗")} ${colors.reset("Database connection failed")}`
    );
    process.exit(1);
  }
};

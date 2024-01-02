const { getEnv } = require("../utils/helpers");

exports.env = () => {
  return {
    port: getEnv("PORT", 3000),
    databaseUrl: getEnv("DATABASE_URL"),
    jwtSecret: getEnv("JWT_SECRET"),
    jwtExpiration: getEnv("JWT_EXPIRES_IN", "7d"),
    jwtRefreshExpiration: getEnv("JWT_REFRESH_TOKEN_EXPIRES_IN", "30d"),

    // SMTP
    smtpHost: getEnv("SMTP_HOST"),
    smtpPort: getEnv("SMTP_PORT"),
    smtpUser: getEnv("SMTP_USER"),
    smtpPassword: getEnv("SMTP_PASSWORD"),
    smtpFromName: getEnv("SMTP_FROM_NAME"),
    smtpFromEmail: getEnv("SMTP_FROM_EMAIL"),
  };
};

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { env } = require("../config/env");

/**
 * This function gets the environment variable.
 * @param {string} key - environment variable key
 * @param {string} defaultValue - default value
 * @returns {string} environment variable
 */
exports.getEnv = (key, defaultValue = "") => {
  const value = process.env[key];

  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is missing`);
  }

  if (value === undefined) {
    return defaultValue;
  }
  return value;
};

/**
 * This function generates a reset code.
 * @returns {string} reset code
 */
exports.generateResetCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * This function hashes a password.
 * @param {string} password - password
 * @returns {string} hashed password
 */
exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

/**
 * This function compares a password.
 * @param {string} password - password
 * @param {string} hashedPassword - hashed password
 * @returns {boolean} true/false
 */
exports.comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

/**
 * This function generates a token.
 * @param {Object} payload - payload
 * @param {string} secret - secret
 * @param {string} expiresIn - expires in
 * @returns {string} token
 */
exports.generateToken = ({
  payload,
  secret = this.getEnv("JWT_SECRET"),
  expiresIn = this.getEnv("JWT_EXPIRES_IN"),
}) => {
  try {
    return jsonwebtoken.sign(payload, secret, { expiresIn });
  } catch (error) {
    throw error;
  }
};

/**
 * This function verifies a token.
 * @param {string} token - token
 * @returns {Object} payload
 */
exports.verifyToken = ({ token, secret = this.getEnv("JWT_SECRET") }) => {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch (error) {
    throw error;
  }
};

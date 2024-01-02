/**
 * Format error message
 * @description This function is used to format error message
 * @param {Object} error - error object
 * @returns {string} error message
 */

exports.formatError = (error) => {
  if (typeof error === "string") {
    if (error.includes("Cast to ObjectId failed")) {
      return "Invalid id";
    }

    if (error.includes("E11000 duplicate key error collection")) {
      const field = error.split("index: ")[1];
      const duplicate = field.split(" dup key")[0];

      return `Duplicate ${duplicate} already exists`;
    }

    if (error.includes("jwt malformed")) {
      return "Invalid token";
    }
    return error;
  }

  return "Something went wrong";
};

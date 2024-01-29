const { User: schema } = require("../models/user.model");
const { formatError } = require("../utils/format-error");
const { infinityPagination } = require("../utils/infinity-pagination");

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";

    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const result = await infinityPagination(schema, page, limit, searchQuery);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const result = await schema.findById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const result = await schema.findOneAndUpdate({ _id: id }, req.body);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

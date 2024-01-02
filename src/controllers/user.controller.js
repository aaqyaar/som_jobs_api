const { User: schema } = require("../models/user.model");

exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchQuery = req.query.search ? {} : {};

    const startIndex = (page - 1) * limit;

    const [result, total] = await Promise.all([
      await schema
        .find(searchQuery)
        .limit(limit)
        .skip(startIndex)
        .select("-password")
        .exec(),
      await schema.countDocuments(),
    ]);

    res.status(200).json({
      numberOfPages: Math.floor(total / limit),
      currentPage: page,
      total,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const result = await schema.findById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

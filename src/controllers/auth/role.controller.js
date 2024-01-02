const {
  Role: schema,
  Permission: permissionSchema,
} = require("../../models/role.model");
const { formatError } = require("../../utils/format-error");

exports.createRole = async (req, res, next) => {
  try {
    const result = await schema.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getRoles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";

    const searchQuery = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const startIndex = (page - 1) * limit;

    const [result, total] = await Promise.all([
      await schema.find(searchQuery).limit(limit).skip(startIndex).exec(),
      await schema.countDocuments(),
    ]);

    res.status(200).json({
      numberOfPages: Math.floor(total / limit),
      currentPage: page,
      total,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getRole = async (req, res, next) => {
  try {
    const result = await schema.findById(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: "Role not found",
        status: "error",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.createPermission = async (req, res, next) => {
  try {
    const result = await permissionSchema.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.createPermissions = async (req, res, next) => {
  try {
    const result = await permissionSchema.insertMany(req.body);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getPermissions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const search = req.query.search || "";

    const searchQuery = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const startIndex = (page - 1) * limit;

    const [result, total] = await Promise.all([
      await permissionSchema
        .find(searchQuery)
        .limit(limit)
        .skip(startIndex)
        .exec(),
      await permissionSchema.countDocuments(),
    ]);

    res.status(200).json({
      numberOfPages: Math.floor(total / limit),
      currentPage: page,
      total,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

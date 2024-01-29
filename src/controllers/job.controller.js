const { Job: schema } = require("../models/job.model");
const { formatError } = require("../utils/format-error");
const { infinityPagination } = require("../utils/infinity-pagination");

exports.createJob = async (req, res) => {
  try {
    const user = req.user;
    const job = await schema.create({ ...req.body, user: user?._id });
    return res.status(201).json(job);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.createJobs = async (req, res) => {
  try {
    const jobs = await schema.insertMany(req.body);
    return res.status(201).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const search = req.query.search || "";

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const result = await infinityPagination(schema, page, limit, searchQuery);

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.getJob = async (req, res) => {
  try {
    const result = await schema.findById(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await schema.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        status: "error",
      });
    }

    const updatedJob = await schema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedJob);
  } catch (error) {
    return res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await schema.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        status: "error",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not allowed to delete this job",
        status: "error",
      });
    }

    await schema.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Job deleted successfully",
      status: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

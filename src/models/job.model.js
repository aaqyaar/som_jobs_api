const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true, default: "Negotitable" },
    tags: { type: String, required: true },
    company: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    requirements: { type: String, required: true },
    benefits: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Job = model("Job", schema);

module.exports = { Job };

const { Schema, model } = require("mongoose");
const { hashPassword } = require("../utils/helpers");

const schema = new Schema(
  {
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    name: String,
    password: String,
    photoUrl: String,
    roles: [{ type: Schema.Types.ObjectId, ref: "Role" }],
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "ACTIVE",
    },
    resetCode: { type: String, default: undefined },
    resetCodeExpiry: { type: Date, default: undefined },
  },
  {
    timestamps: true,
  }
);

const refreshTokenSchema = new Schema({
  token: { type: String, unique: true },
  expiry: Date,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

schema.pre("save", function (next) {
  if (this.isModified("password")) {
    try {
      this.password = hashPassword(this.password);
      next();
    } catch (error) {
      next(error);
    }
  }
});

const User = model("User", schema);
const RefreshToken = model("RefreshToken", refreshTokenSchema);

module.exports = { User, RefreshToken };

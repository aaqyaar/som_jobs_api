const { Schema, model } = require("mongoose");

const permissionSchema = new Schema(
  {
    name: { type: String, unique: true, uppercase: true },
    action: {
      type: String,
      enum: ["CREATE", "READ", "UPDATE", "DELETE"],
      uppercase: true,
    },
    subject: String,
    role: { type: Schema.Types.ObjectId, ref: "Role" },
  },
  {
    timestamps: true,
  }
);

const roleSchema = new Schema(
  {
    name: { type: String, unique: true },
    permissions: [permissionSchema],
  },
  { timestamps: true }
);

const Role = model("Role", roleSchema);

const Permission = model("Permission", permissionSchema);

module.exports = { Role, Permission };

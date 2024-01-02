const Subjects = require("../utils/subjects");
const z = require("zod");

exports.registerSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Email is not valid"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  phone: z.string({
    required_error: "Phone is required",
  }),
  name: z.string().optional(),
  photoUrl: z.string().url().optional(),

  roles: z
    .array(
      z.string({
        required_error: "Role is required",
      })
    )
    .min(1, "Atleast one role is required"),
});

exports.loginSchema = z.object({
  username: z
    .string({
      required_error: "Username must be email or phone and is required",
    })
    .email("Username must be valid email or phone"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

exports.roleSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
});

exports.permissionSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  subject: z.enum([Subjects.User, Subjects.Role, Subjects.Permission]),
  action: z.enum(["READ", "CREATE", "UPDATE", "DELETE"], {
    required_error: "Action is required",
  }),
  role: z.string({
    required_error: "Role is required",
  }),
});

// convert into array of permissionSchema
exports.permissionsSchema = z.array(
  z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    subject: z.enum([Subjects.User, Subjects.Role, Subjects.Permission]),
    action: z.enum(["READ", "CREATE", "UPDATE", "DELETE"], {
      required_error: "Action is required",
    }),
    role: z.string({
      required_error: "Role is required",
    }),
  })
);

exports.forgotPasswordSchema = z.object({
  username: z
    .string({
      required_error: "Username must be email or phone and is required",
    })
    .email("Username must be valid email or phone"),
});

exports.resetPasswordSchema = z.object({
  resetCode: z.string({
    required_error: "Reset Code is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

exports.refreshTokenSchema = z.object({
  refreshToken: z.string({
    required_error: "Refresh token is required",
  }),
});

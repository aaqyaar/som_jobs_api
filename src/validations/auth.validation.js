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

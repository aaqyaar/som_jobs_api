const {
  User: schema,
  RefreshToken: refreshSchema,
} = require("../../models/user.model");
const {
  generateResetCode,
  comparePassword,
  generateToken,
  getEnv,
  hashPassword,
} = require("../../utils/helpers");
const { formatError } = require("../../utils/format-error");
const { sendEmail } = require("../../mail/nodemailer");
const { env } = require("../../config/env");

/**
 * Generate access token and refresh token
 * @param {*} res
 * @param {*} user
 * @returns { accessToken, refreshToken }
 * { accessToken, refreshToken }
 */
const createToken = (res, user) => {
  const accessToken = generateToken({ payload: user });
  const refreshToken = generateToken({
    payload: user,
    expiresIn: env().jwtRefreshExpiration,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });
  return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await schema
      .findOne({
        $or: [{ email: username }, { phone: username }],
      })
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }

    if (user.status === "BLOCKED") {
      return res.status(401).json({
        message: "Your account is blocked",
        status: "error",
      });
    }

    const isPasswordMatch = await comparePassword(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Password is not match",
        status: "error",
      });
    }

    const {
      password: _,
      resetToken: __,
      resetTokenExpiry: ___,
      createdAt: ____,
      updatedAt: _____,
      __v: ______,
      ...rest
    } = user;

    const data = createToken(res, rest);

    await refreshSchema.create({
      token: data.refreshToken,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: user._id,
    });

    res.status(200).json({
      status: "success",
      data: { ...data, ...rest },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    const result = await schema.create(req.body);

    const {
      password: _,
      resetToken: __,
      resetTokenExpiry: ___,
      createdAt: ____,
      updatedAt: _____,
      __v: ______,
      ...rest
    } = result._doc;

    const data = createToken(res, rest);

    await refreshSchema.create({
      token: data.refreshToken,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: result._id,
    });

    res.status(201).json({
      status: "success",
      data: { ...data, ...rest },
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    await refreshSchema.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({
      status: "success",
      message: "Logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const token = await refreshSchema.findOne({ token: refreshToken });

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token is expired
    const isExpired = new Date(token.expiry) < new Date(Date.now());

    if (isExpired) {
      await refreshSchema.deleteOne({ token: refreshToken });

      return res.status(401).json({
        status: "error",
        message: "Refresh token is expired, please sign in again",
      });
    }

    const user = await schema
      .findById(token.user)
      .select(["-password", "-createdAt", "updatedAt", "-__v"])
      .lean();

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }

    const data = createToken(res, user);

    await refreshSchema.create({
      token: refreshToken,
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      user: user._id,
    });

    res.status(201).json({
      status: "success",
      data: { ...data },
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await schema.findOne({
      $or: [{ email: username }, { phone: username }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "error",
      });
    }

    const resetCode = generateResetCode();

    await schema.updateOne(
      { _id: user._id },
      {
        resetCode,
        resetCodeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      }
    );
    await sendEmail({
      to: user.email,
      subject: "Reset Password",
      text: `Your reset code is ${resetCode} and will be expired in 10 minutes from now, <br /> please use this token to reset your password <br /> <br /> Thank you, <br /> ${getEnv(
        "APP_NAME",
        "SomJobs"
      )} support team`,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token has been sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { resetCode, password } = req.body;

    const user = await schema.findOne({
      resetCode,
      resetCodeExpiry: { $gte: new Date(Date.now()) },
    });

    if (!user) {
      return res.status(404).json({
        message: "Reset code is invalid or expired",
        status: "error",
      });
    }
    const hashedPassword = await hashPassword(password);

    await schema.findByIdAndUpdate(
      { _id: user._id },
      {
        $unset: {
          resetCode: "",
          resetCodeExpiry: "",
        },
        password: hashedPassword,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: formatError(error?.message || error.toString()),
      status: "error",
    });
  }
};

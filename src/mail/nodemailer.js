const nodemailer = require("nodemailer");
const { env } = require("../config/env");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: env().smtpHost,
    port: env().smtpPort,
    secure: true,
    auth: {
      user: env().smtpUser,
      pass: env().smtpPassword,
    },
  });

  const message = {
    from: `${env().smtpFromName} <${env().smtpFromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  const info = await transporter.sendMail(message);

  console.log(`Message sent: ${info.messageId}`);
};

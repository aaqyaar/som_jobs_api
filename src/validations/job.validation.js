const z = require("zod");

exports.jobSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  salary: z.string().default("Negotiable"),
  tags: z.string({ required_error: "Tags is required" }),
  company: z.string({ required_error: "Company is required" }),
  address: z.string({ required_error: "Address is required" }),
  city: z.string({ required_error: "City is required" }),
  state: z.string({ required_error: "State is required" }),
  phone: z.string({ required_error: "Phone is required" }),
  email: z
    .string()
    .email()
    .transform((email) => email.toLowerCase()),
  requirements: z.string({ required_error: "Requirements is required" }),
  benefits: z.string({ required_error: "Benefits is required" }),
});

exports.bulkJobSchema = z.array(
  z.object({
    user: z.string({ required_error: "User is required" }),
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ required_error: "Description is required" }),
    salary: z.string().default("Negotiable"),
    tags: z.string({ required_error: "Tags is required" }),
    company: z.string({ required_error: "Company is required" }),
    address: z.string({ required_error: "Address is required" }),
    city: z.string({ required_error: "City is required" }),
    state: z.string({ required_error: "State is required" }),
    phone: z.string({ required_error: "Phone is required" }),
    email: z
      .string()
      .email()
      .transform((email) => email.toLowerCase()),
    requirements: z.string({ required_error: "Requirements is required" }),
    benefits: z.string({ required_error: "Benefits is required" }),
  })
);

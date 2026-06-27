const { z } = require("zod");

const leadSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10).max(15),
  linkedIn: z.string().url().optional().or(z.literal("")),

  type: z.enum(["FOUNDER", "INVESTOR"]),

  founder: z
    .object({
      startupName: z.string().min(2),
      background: z.string().min(5),
      problem: z.string().min(10),

      mvpStatus: z.enum([
        "IDEA",
        "IN_PROGRESS",
        "COMPLETED",
      ]),

      traction: z.string().optional(),
      teamSize: z.number().optional(),
      fundingAsk: z.number().optional(),
      validationEvidence: z.string().optional(),

      extraResponses: z.any().optional(),
    })
    .optional(),

  investor: z
    .object({
      investmentThesis: z.string().min(10),
      stageFocus: z.string().min(2),
      chequeSize: z.number().optional(),

      currentPortfolio: z.string().optional(),
      supportModel: z.string().optional(),
      deploymentTimeline: z.string().optional(),

      extraResponses: z.any().optional(),
    })
    .optional(),
});

module.exports = {
  leadSchema,
};
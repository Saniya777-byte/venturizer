const { z } = require("zod");

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((value) => value || undefined);

const optionalText = z
  .union([z.string(), z.literal(""), z.null()])
  .optional()
  .transform((value) => value || undefined);

const numberFromInput = (schema) =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  }, schema);

const answerSchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string(),
});

const founderSchema = z.object({
  role: z.string().min(2),
  companyName: z.string().min(2),
  startupDescription: z.string().min(2),
  background: z.string().min(10),
  problem: z.string().min(10),
  customer: z.string().min(10),
  mvpStatus: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
  mvpLink: optionalUrl,
  traction: optionalText,
  teamSize: numberFromInput(z.number().int().min(1).optional()),
  teamFullTime: optionalText,
  fundingAsk: numberFromInput(z.number().min(0).optional()),
  fundingStage: optionalText,
  useOfFunds: optionalText,
  validationEvidence: optionalText,
  notableBacking: optionalText,
});

const investorSchema = z.object({
  firmName: z.string().min(2),
  roleAtFirm: z.string().min(2),
  investmentThesis: z.string().min(10),
  sectors: z.string().min(10),
  stageFocus: z.string().min(2),
  leadOrFollow: z.string().min(2),
  chequeSize: numberFromInput(z.number().min(0).optional()),
  chequeRange: optionalText,
  currentPortfolio: optionalText,
  portfolioConflicts: optionalText,
  supportModel: z.string().min(10),
  handsOnLevel: z.string().min(2),
  dealsPerYear: numberFromInput(z.number().int().min(0).optional()),
  capitalAvailable: z.string().min(2),
  deploymentTimeline: z.string().min(2),
});

const createLeadSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email().toLowerCase(),
    phone: z.string().min(2),
    linkedIn: optionalUrl,
    type: z.enum(["FOUNDER", "INVESTOR"]),
    founder: founderSchema.optional(),
    investor: investorSchema.optional(),
    answers: z.array(answerSchema).min(1),
  })
  .superRefine((data, ctx) => {
    if (data.type === "FOUNDER" && !data.founder) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["founder"],
        message: "Founder profile is required.",
      });
    }

    if (data.type === "INVESTOR" && !data.investor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["investor"],
        message: "Investor profile is required.",
      });
    }
  });

const leadListQuerySchema = z.object({
  page: numberFromInput(z.number().int().min(1).default(1)),
  limit: numberFromInput(z.number().int().min(1).default(10)),
  search: z.string().optional(),
  type: z.enum(["FOUNDER", "INVESTOR"]).optional(),
  status: z.enum(["HOT", "GOOD", "MAYBE", "LOW"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "score", "fullName", "status", "type"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

const leadIdParamSchema = z.object({
  id: z.string().min(1),
});

const updateLeadStatusSchema = z.object({
  status: z.enum(["HOT", "GOOD", "MAYBE", "LOW"]),
});

module.exports = {
  createLeadSchema,
  leadListQuerySchema,
  leadIdParamSchema,
  updateLeadStatusSchema,
};

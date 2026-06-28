const prisma = require("../database/prisma");
const { calculateLeadScore } = require("./scoring.service");
const { evaluateAnswer, generateSummary } = require("./gemini.service");
const { createHttpError } = require("../utils/httpError");

const FOUNDER_AI_FIELDS = [
  "background",
  "problem",
  "startupDescription",
  "customer",
  "traction",
  "validationEvidence",
  "useOfFunds",
];

const INVESTOR_AI_FIELDS = [
  "investmentThesis",
  "sectors",
  "currentPortfolio",
  "supportModel",
];

const searchableRelations = (search) => {
  if (!search) return [];

  return [
    { fullName: { contains: search, mode: "insensitive" } },
    { email: { contains: search, mode: "insensitive" } },
    { phone: { contains: search, mode: "insensitive" } },
    { founder: { is: { companyName: { contains: search, mode: "insensitive" } } } },
    { investor: { is: { firmName: { contains: search, mode: "insensitive" } } } },
  ];
};

const buildLeadWhere = ({ search, type, status }) => ({
  ...(type ? { type } : {}),
  ...(status ? { status } : {}),
  ...(search ? { OR: searchableRelations(search) } : {}),
});

const collectAiScores = async (type, profile) => {
  const fields = type === "FOUNDER" ? FOUNDER_AI_FIELDS : INVESTOR_AI_FIELDS;
  const entries = await Promise.all(
    fields
      .filter((field) => typeof profile[field] === "string" && profile[field].trim().length >= 2)
      .map(async (field) => {
        const result = await evaluateAnswer(field, profile[field]);
        return [field, result];
      })
  );
  return Object.fromEntries(entries);
};

const createLead = async (data) => {
  const profile = data.type === "FOUNDER" ? data.founder : data.investor;

  const [aiScores, aiSummary] = await Promise.all([
    collectAiScores(data.type, profile),
    generateSummary(data.type, profile, data.answers),
  ]);

  const score = calculateLeadScore(data, aiScores);

  return prisma.lead.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      linkedIn: data.linkedIn,
      type: data.type,
      score: score.total,
      status: score.status,
      completed: true,
      founder: data.type === "FOUNDER" ? { create: data.founder } : undefined,
      investor: data.type === "INVESTOR" ? { create: data.investor } : undefined,
      answers: {
        create: data.answers.map((answer) => ({
          questionId: answer.questionId,
          question: answer.question,
          answer: answer.answer,
        })),
      },
      scoreDetails: {
        create: score.breakdown,
      },
      aiSummary: {
        create: aiSummary,
      },
    },
    include: {
      founder: true,
      investor: true,
      scoreDetails: true,
      aiSummary: true,
    },
  });
};

const listLeads = async (query) => {
  const page = Number(query.page);
  const limit = Number(query.limit);
  const skip = (page - 1) * limit;
  const where = buildLeadWhere(query);

  const [items, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [query.sortBy]: query.sortOrder },
      include: {
        founder: true,
        investor: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getLeadById = async (id) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      founder: true,
      investor: true,
      answers: { orderBy: { createdAt: "asc" } },
      scoreDetails: { orderBy: { createdAt: "asc" } },
      aiSummary: true,
    },
  });

  if (!lead) {
    throw createHttpError(404, "Lead not found.");
  }

  if (!lead.aiSummary || lead.aiSummary.summary === "Summary unavailable.") {
    const profile = lead.type === "FOUNDER" ? lead.founder : lead.investor;
    const aiSummary = await generateSummary(lead.type, profile, lead.answers);
    const savedSummary = await prisma.aiSummary.upsert({
      where: { leadId: lead.id },
      update: {
        summary: aiSummary.summary,
        strengths: aiSummary.strengths,
        weaknesses: aiSummary.weaknesses,
        recommendation: aiSummary.recommendation,
      },
      create: {
        summary: aiSummary.summary,
        strengths: aiSummary.strengths,
        weaknesses: aiSummary.weaknesses,
        recommendation: aiSummary.recommendation,
        leadId: lead.id,
      },
    });
    lead.aiSummary = savedSummary;
  }

  return lead;
};

const updateLeadStatus = async (id, status) => {
  await getLeadById(id);

  return prisma.lead.update({
    where: { id },
    data: { status },
    include: {
      founder: true,
      investor: true,
    },
  });
};

module.exports = {
  createLead,
  listLeads,
  getLeadById,
  updateLeadStatus,
};

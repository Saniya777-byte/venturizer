const leadService = require("../services/lead.service");
const { evaluateAnswer } = require("../services/gemini.service");

const createLead = async (req, res) => {
  const lead = await leadService.createLead(req.body);

  res.status(201).json({
    success: true,
    data: lead,
  });
};

const listLeads = async (req, res) => {
  const result = await leadService.listLeads(req.validated.query);

  res.json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};

const getLeadById = async (req, res) => {
  const lead = await leadService.getLeadById(req.validated.params.id);

  res.json({
    success: true,
    data: lead,
  });
};

const updateLeadStatus = async (req, res) => {
  const lead = await leadService.updateLeadStatus(req.validated.params.id, req.body.status);

  res.json({
    success: true,
    data: lead,
  });
};

const validateAnswer = async (req, res) => {
  const { field, answer } = req.body;
  const result = await evaluateAnswer(field, answer);

  res.json({
    success: true,
    data: result,
  });
};

module.exports = {
  createLead,
  listLeads,
  getLeadById,
  updateLeadStatus,
  validateAnswer,
};


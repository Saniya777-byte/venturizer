const express = require("express");
const leadController = require("../controllers/lead.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const {
  createLeadSchema,
  leadListQuerySchema,
  leadIdParamSchema,
  updateLeadStatusSchema,
} = require("../validators/lead.validator");
const { z } = require("zod");

const router = express.Router();

router.get(
  "/",
  validateRequest({ query: leadListQuerySchema }),
  asyncHandler(leadController.listLeads)
);

router.post(
  "/",
  validateRequest({ body: createLeadSchema }),
  asyncHandler(leadController.createLead)
);

router.post(
  "/validate-answer",
  validateRequest({
    body: z.object({
      field: z.string().min(1).max(80),
      answer: z.string().min(1).max(5000),
    }),
  }),
  asyncHandler(leadController.validateAnswer)
);

router.get(
  "/:id",
  validateRequest({ params: leadIdParamSchema }),
  asyncHandler(leadController.getLeadById)
);

router.patch(
  "/:id/status",
  validateRequest({
    params: leadIdParamSchema,
    body: updateLeadStatusSchema,
  }),
  asyncHandler(leadController.updateLeadStatus)
);

module.exports = router;


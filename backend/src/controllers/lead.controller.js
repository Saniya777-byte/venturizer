const prisma = require("../database/prisma");
const { leadSchema } = require("../validators/lead.validator");

const createLead = async (req, res) => {
  try {
    const data = leadSchema.parse(req.body);

    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedIn: data.linkedIn,
        type: data.type,

        founder:
          data.type === "FOUNDER"
            ? {
                create: data.founder,
              }
            : undefined,

        investor:
          data.type === "INVESTOR"
            ? {
                create: data.investor,
              }
            : undefined,
      },
      include: {
        founder: true,
        investor: true,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createLead,
};
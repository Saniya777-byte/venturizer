export const investorQuestions = [

  // CONTACT INFORMATION


  {
    id: "fullName",
    category: "contact",
    type: "text",
    prompt: "Welcome! What's your full name?",
    placeholder: "John Doe",
    validation: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
  },

  {
    id: "email",
    category: "contact",
    type: "email",
    prompt: "What's your email address?",
    placeholder: "john@example.com",
    validation: {
      required: true,
      pattern: "email",
    },
  },

  {
    id: "phone",
    category: "contact",
    type: "tel",
    prompt: "What's the best phone number to reach you?",
    placeholder: "+91 9876543210",
    validation: {
      required: true,
      pattern: "phone",
    },
  },

  {
    id: "linkedIn",
    category: "contact",
    type: "url",
    prompt: "Share your LinkedIn profile (optional).",
    placeholder: "https://linkedin.com/in/yourname",
    validation: {
      required: false,
      pattern: "url",
    },
  },


  // INVESTOR PROFILE


  {
    id: "firmName",
    category: "profile",
    type: "text",
    prompt: "What's your firm's name?",
    placeholder: "Peak XV Partners",
    validation: {
      required: true,
      minLength: 2,
    },
  },

  {
    id: "roleAtFirm",
    category: "profile",
    type: "text",
    prompt: "What's your role there?",
    placeholder: "Partner",
    validation: {
      required: true,
      minLength: 2,
    },
  },

  {
    id: "investmentThesis",
    category: "profile",
    type: "textarea",
    prompt:
      "Describe your investment thesis. What kind of founders or companies excite you?",
    placeholder:
      "We invest in founder-first B2B SaaS companies...",
    validation: {
      required: true,
      minLength: 30,
    },
  },

  {
    id: "sectors",
    category: "profile",
    type: "textarea",
    prompt: "Which industries or sectors do you actively invest in?",
    placeholder: "AI, FinTech, Healthcare...",
    validation: {
      required: true,
      minLength: 10,
    },
  },

  // INVESTMENT PREFERENCES


  {
    id: "stageFocus",
    category: "investment",
    type: "choice",
    prompt: "Which startup stage do you primarily invest in?",
    options: [
      {
        label: "Pre-Seed",
        value: "PRE_SEED",
      },
      {
        label: "Seed",
        value: "SEED",
      },
      {
        label: "Series A",
        value: "SERIES_A",
      },
      {
        label: "Growth Stage",
        value: "GROWTH",
      },
    ],
    validation: {
      required: true,
    },
  },

  {
    id: "leadOrFollow",
    category: "investment",
    type: "choice",
    prompt: "Do you usually lead investment rounds or participate as a follower?",
    options: [
      {
        label: "Lead",
        value: "LEAD",
      },
      {
        label: "Follow",
        value: "FOLLOW",
      },
      {
        label: "Both",
        value: "BOTH",
      },
    ],
    validation: {
      required: true,
    },
  },

  {
    id: "chequeSize",
    category: "investment",
    type: "number",
    prompt: "What's your typical investment amount per startup? (₹)",
    placeholder: "2500000",
    validation: {
      required: true,
      min: 0,
    },
  },

  {
    id: "chequeRange",
    category: "investment",
    type: "text",
    prompt: "What's your minimum and maximum cheque size?",
    placeholder: "₹10L - ₹1Cr",
    validation: {
      required: false,
      minLength: 3,
    },
  },


  // PORTFOLIO


  {
    id: "currentPortfolio",
    category: "portfolio",
    type: "textarea",
    prompt: "Mention a few startups from your current portfolio.",
    placeholder:
      "Startup A, Startup B, Startup C...",
    validation: {
      required: true,
      minLength: 10,
    },
  },

  {
    id: "portfolioConflicts",
    category: "portfolio",
    type: "textarea",
    prompt:
      "Any conflicts of interest or competing investments we should know about? (Optional)",
    placeholder: "None",
    validation: {
      required: false,
      minLength: 3,
    },
  },


  // SUPPORT MODEL


  {
    id: "supportModel",
    category: "support",
    type: "textarea",
    prompt:
      "Beyond funding, how do you typically support your portfolio companies?",
    placeholder:
      "Hiring, GTM strategy, fundraising, introductions, operations...",
    validation: {
      required: true,
      minLength: 20,
    },
  },

  {
    id: "handsOnLevel",
    category: "support",
    type: "choice",
    prompt: "How involved are you after making an investment?",
    options: [
      {
        label: "Very Hands-on",
        value: "VERY_HANDS_ON",
      },
      {
        label: "Moderately Involved",
        value: "MODERATE",
      },
      {
        label: "Mostly Hands-off",
        value: "HANDS_OFF",
      },
    ],
    validation: {
      required: true,
    },
  },


  // CAPITAL & TIMELINE


  {
    id: "dealsPerYear",
    category: "investment",
    type: "number",
    prompt: "Approximately how many startup investments do you make each year?",
    placeholder: "10",
    validation: {
      required: true,
      min: 0,
      max: 1000,
    },
  },

  {
    id: "capitalAvailable",
    category: "investment",
    type: "choice",
    prompt: "Do you currently have capital available for new investments?",
    options: [
      {
        label: "Yes, actively investing",
        value: "AVAILABLE",
      },
      {
        label: "Limited capital available",
        value: "LIMITED",
      },
      {
        label: "Not currently",
        value: "NOT_AVAILABLE",
      },
    ],
    validation: {
      required: true,
    },
  },

  {
    id: "deploymentTimeline",
    category: "investment",
    type: "choice",
    prompt: "Once you find a promising startup, how quickly can you typically make an investment decision?",
    options: [
      {
        label: "Within 1 Week",
        value: "ONE_WEEK",
      },
      {
        label: "2–4 Weeks",
        value: "TWO_TO_FOUR_WEEKS",
      },
      {
        label: "1–3 Months",
        value: "ONE_TO_THREE_MONTHS",
      },
      {
        label: "More than 3 Months",
        value: "MORE_THAN_THREE_MONTHS",
      },
    ],
    validation: {
      required: true,
    },
  },


  // FINAL


  {
    id: "additionalInfo",
    category: "additional",
    type: "textarea",
    prompt:
      "Is there anything else you'd like the Venturizer team to know before reviewing your profile?",
    placeholder:
      "Share anything that would help us better understand your investment approach...",
    validation: {
      required: false,
      minLength: 10,
    },
  },
];

// FLOW METADATA

export const investorFlow = {
  id: "INVESTOR",

  title: "Investor Qualification",

  description:
    "Help us understand your investment profile so we can connect you with the right founders and opportunities inside the Venturizer ecosystem.",

  estimatedTime: "5-7 minutes",

  totalQuestions: investorQuestions.length,

  completionMessage:
    "🎉 Thank you! Your investor profile has been submitted successfully. Our team will review your information and contact you with relevant opportunities."
};


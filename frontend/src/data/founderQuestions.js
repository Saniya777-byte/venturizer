export const founderQuestions = [
  // CONTACT INFORMATION

  {
    id: "fullName",
    category: "contact",
    type: "text",
    prompt: "Welcome! Let's start with your full name.",
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

  // FOUNDER BACKGROUND

  {
    id: "role",
    category: "background",
    type: "text",
    prompt: "What's your role in the startup?",
    placeholder: "Founder & CEO",
    validation: {
      required: true,
      minLength: 2,
    },
  },

  {
    id: "companyName",
    category: "background",
    type: "text",
    prompt: "What's your startup/company name?",
    placeholder: "Acme AI",
    validation: {
      required: true,
      minLength: 2,
    },
  },

  {
    id: "startupDescription",
    category: "background",
    type: "text",
    prompt: "Describe your startup in one sentence.",
    placeholder: "AI platform helping hospitals...",
    validation: {
      required: true,
      minLength: 10,
    },
  },

  {
    id: "background",
    category: "background",
    type: "textarea",
    prompt:
      "Tell us about yourself. Previous startups, work experience, domain expertise or achievements.",
    placeholder: "I have 5 years of...",
    validation: {
      required: true,
      minLength: 30,
    },
  },

  // PROBLEM

  {
    id: "problem",
    category: "problem",
    type: "textarea",
    prompt: "What problem are you solving?",
    placeholder: "People struggle with...",
    validation: {
      required: true,
      minLength: 25,
    },
  },

  {
    id: "customer",
    category: "problem",
    type: "textarea",
    prompt: "Who is your ideal customer?",
    placeholder: "SMEs, Hospitals, Students...",
    validation: {
      required: true,
      minLength: 15,
    },
  },
  // MVP

  {
    id: "mvpStatus",
    category: "mvp",
    type: "choice",
    prompt: "What's the current stage of your product?",
    options: [
      {
        label: "Live Product",
        value: "COMPLETED",
      },
      {
        label: "Currently Building",
        value: "IN_PROGRESS",
      },
      {
        label: "Idea Stage",
        value: "IDEA",
      },
    ],
    validation: {
      required: true,
    },
  },

  {
    id: "mvpLink",
    category: "mvp",
    type: "url",
    prompt: "Share your product/demo/website link.",
    placeholder: "https://...",
    validation: {
      required: false,
      pattern: "url",
    },
    skipIf: (answers) => answers.mvpStatus === "IDEA",
  },

  // TRACTION

  {
    id: "traction",
    category: "traction",
    type: "textarea",
    prompt:
      "Tell us about your traction. Users, revenue, pilots, growth or anything measurable.",
    placeholder: "500 users, ₹2L MRR...",
    validation: {
      required: false,
      minLength: 5,
    },
    skipIf: (answers) => answers.mvpStatus === "IDEA",
  },

  {
    id: "teamSize",
    category: "team",
    type: "number",
    prompt: "How many core team members are currently working on this startup?",
    validation: {
      required: true,
      min: 1,
      max: 100,
    },
  },

  {
    id: "teamFullTime",
    category: "team",
    type: "choice",
    prompt: "Is your founding team working full-time?",
    options: [
      {
        label: "Yes",
        value: "YES",
      },
      {
        label: "Partially",
        value: "PARTIAL",
      },
      {
        label: "No",
        value: "NO",
      },
    ],
    validation: {
      required: true,
    },
  },

  // FUNDING

  {
    id: "fundingAsk",
    category: "funding",
    type: "number",
    prompt: "How much funding are you looking to raise? (₹)",
    placeholder: "5000000",
    validation: {
      required: true,
      min: 0,
    },
  },

  {
    id: "fundingStage",
    category: "funding",
    type: "choice",
    prompt: "Which funding stage best describes your startup?",
    options: [
      {
        label: "Bootstrapped",
        value: "BOOTSTRAPPED",
      },
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
    ],
    validation: {
      required: true,
    },
  },

  {
    id: "useOfFunds",
    category: "funding",
    type: "textarea",
    prompt: "How will you use the investment?",
    placeholder:
      "Hiring, Product Development, Sales & Marketing...",
    validation: {
      required: true,
      minLength: 20,
    },
  },
  // VALIDATION & PROOF

  {
    id: "validationEvidence",
    category: "validation",
    type: "textarea",
    prompt:
      "What proof do you have that customers need your product? (LOIs, paying customers, waitlist, surveys, pilot customers, etc.)",
    placeholder:
      "500+ waitlist, 10 paying customers, 3 pilot clients...",
    validation: {
      required: true,
      minLength: 20,
    },
  },

  {
    id: "notableBacking",
    category: "validation",
    type: "textarea",
    prompt:
      "Any incubators, accelerators, grants, awards, media coverage or notable mentors? (Optional)",
    placeholder:
      "Y Combinator, Startup India, IIT Incubator...",
    validation: {
      required: false,
      minLength: 5,
    },
  },

  // FINAL

  {
    id: "additionalInfo",
    category: "additional",
    type: "textarea",
    prompt:
      "Is there anything else you'd like our investment team to know before reviewing your application?",
    placeholder:
      "Share anything that makes your startup stand out...",
    validation: {
      required: false,
      minLength: 10,
    },
  }
]
// METADAT

export const founderFlow = {
  id: "FOUNDER",

  title: "Founder Qualification",

  description:
    "Let's understand your startup better so we can evaluate whether Venturizer is the right ecosystem for you.",

  estimatedTime: "5-7 minutes",

  totalQuestions: founderQuestions.length,

  completionMessage:
    "🎉 Thank you! Your application has been submitted successfully. Our team will review your responses and reach out if there's a potential fit.",
};

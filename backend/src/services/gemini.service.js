const { GoogleGenerativeAI } = require("@google/generative-ai");
const env = require("../config/env");

const isDev = env.nodeEnv !== "production";

const FALLBACK_QUALITY = {
  meaningful: true,
  quality: 5,
  reason: "Fallback used",
};

const devLog = (...args) => {
  if (isDev) console.log(...args);
};

const getModel = () => {
  const key = env.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  try {
    const client = new GoogleGenerativeAI(key);
    return client.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
  } catch {
    return null;
  }
};

const generateFallbackSummary = (type, profile = {}) => {
  try {
    if (type === "FOUNDER") {
      const company = profile.companyName || "their startup";
      const desc = profile.startupDescription || "a new venture";
      const role = profile.role || "Founder";

      const summary = `${role} is building ${company}, which is described as: "${desc}". The venture aims to solve a key problem in their target customer segment.`;

      const strengths = [];
      if (profile.background && profile.background.length > 20) {
        strengths.push("Founder has a relevant background and professional experience.");
      }
      if (profile.mvpStatus === "COMPLETED") {
        strengths.push("Has a completed and live product (MVP stage completed).");
      } else if (profile.mvpStatus === "IN_PROGRESS") {
        strengths.push("Currently building and actively developing their product.");
      }
      if (profile.teamSize && profile.teamSize > 1) {
        strengths.push(`Assembled a functional core team of ${profile.teamSize} members.`);
      }
      if (strengths.length === 0) {
        strengths.push("Clean startup registration and defined product scope.");
      }

      const weaknesses = [];
      if (profile.mvpStatus === "IDEA") {
        weaknesses.push("Early idea stage with potential product execution risk.");
      }
      if (!profile.teamSize || profile.teamSize <= 1) {
        weaknesses.push("Solo founder structure carries higher execution and operational dependency.");
      }
      if (!profile.traction || profile.traction.length < 10) {
        weaknesses.push("Limited measurable traction or user metrics reported.");
      }
      if (weaknesses.length === 0) {
        weaknesses.push("Needs additional market validation and customer proof points.");
      }

      const recommendation = profile.mvpStatus === "COMPLETED"
        ? "Schedule an initial partner review to evaluate MVP metrics and validation details."
        : "Conduct a standard review of their product roadmap and market entry strategy.";

      return { summary, strengths, weaknesses, recommendation };
    } else {
      const firm = profile.firmName || "their investment firm";
      const role = profile.roleAtFirm || "Investor";
      const thesis = profile.investmentThesis || "early-stage startups";

      const summary = `${role} at ${firm} with an investment thesis focused on: "${thesis}". They are looking to partner with high-potential founders.`;

      const strengths = [];
      if (profile.currentPortfolio && profile.currentPortfolio.length > 10) {
        strengths.push("Established investment portfolio indicating active market involvement.");
      }
      if (profile.supportModel && profile.supportModel.length > 10) {
        strengths.push("Provides strategic post-investment support to portfolio companies.");
      }
      if (profile.capitalAvailable === "AVAILABLE") {
        strengths.push("Has active capital available for new deployment.");
      }
      if (strengths.length === 0) {
        strengths.push("Registered investment representative with defined preferences.");
      }

      const weaknesses = [];
      if (profile.capitalAvailable === "NOT_AVAILABLE") {
        weaknesses.push("No active capital currently available for new investments.");
      }
      if (!profile.currentPortfolio || profile.currentPortfolio.length < 10) {
        weaknesses.push("Limited portfolio history declared.");
      }
      if (weaknesses.length === 0) {
        weaknesses.push("Requires alignment check against our active startup pipeline.");
      }

      const recommendation = "Add to the investor directory and evaluate for matching with active cohort startups.";

      return { summary, strengths, weaknesses, recommendation };
    }
  } catch (err) {
    return {
      summary: "Summary unavailable.",
      strengths: ["Profile review required."],
      weaknesses: ["Manual review required."],
      recommendation: "Manual review required.",
    };
  }
};

const parseJson = (text) => {
  if (!text || typeof text !== "string") return null;
  try {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
      return null;
    }
    const jsonStr = text.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
};

const evaluateAnswer = async (fieldName, answer) => {
  const prompt = `You are evaluating a text field in a startup/investor qualification form.

Field: "${fieldName}"
Answer: "${answer}"

Determine whether this answer is meaningful and substantive, or is gibberish, keyboard smashing, repeated characters, filler text, or clearly fake.

Respond ONLY with valid JSON in this exact shape:
{"meaningful": boolean, "quality": number, "reason": "string"}

Rules:
- meaningful must be a boolean
- quality must be an integer from 0 to 10 (0 if not meaningful)
- reason must be one short sentence explaining the rating
- meaningful = false for: keyboard patterns (asdf, qwer, zxcv), repeated characters (aaaa, llll), random consonants, nonsensical character sequences, lorem ipsum, test/dummy/fake
- meaningful = true for: real sentences, relevant business context, proper names, actual descriptions even if brief
- Do not return markdown. Return only the JSON object.`;

  devLog(`\nField:\n${fieldName}`);
  devLog(`\nPrompt:\n${prompt}`);

  const model = getModel();
  if (!model) {
    console.log("GEMINI FALLBACK ACTIVATED");
    return FALLBACK_QUALITY;
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    devLog(`\nGemini Response:\n${text}`);

    const parsed = parseJson(text);
    if (
      parsed &&
      typeof parsed.meaningful === "boolean" &&
      typeof parsed.quality === "number" &&
      typeof parsed.reason === "string"
    ) {
      const formattedResult = {
        meaningful: parsed.meaningful,
        quality: Math.max(0, Math.min(10, Math.round(parsed.quality))),
        reason: parsed.reason,
      };

      devLog(`\nMeaningful:\n${formattedResult.meaningful}`);
      devLog(`\nQuality:\n${formattedResult.quality}`);
      devLog(`\nReason:\n${formattedResult.reason}\n`);

      return formattedResult;
    }

    console.log("GEMINI FALLBACK ACTIVATED");
    return FALLBACK_QUALITY;
  } catch (err) {
    console.log("GEMINI FALLBACK ACTIVATED");
    return FALLBACK_QUALITY;
  }
};

const generateSummary = async (type, profile, answers) => {
  const profileStr = JSON.stringify(profile, null, 2);
  const answersStr = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const prompt = `You are a startup and investor analyst reviewing a ${type === "FOUNDER" ? "founder" : "investor"} qualification submission.

Profile:
${profileStr}

Q&A:
${answersStr}

Write a concise analyst report. Respond ONLY with valid JSON in exactly this shape:
{"summary": "string", "strengths": ["string"], "weaknesses": ["string"], "recommendation": "string"}

Rules:
- summary: 2-3 sentences describing the overall lead quality
- strengths: array of 2-4 specific positive signals from the answers
- weaknesses: array of 1-3 specific gaps or risks from the answers
- recommendation: one clear actionable sentence (e.g. "Schedule a discovery call." or "Deprioritise — insufficient traction.")
- Be objective and specific to what was submitted
- Do not invent information not present in the data
- Do not return markdown. Return only the JSON object.`;

  devLog(`\nAI Summary Request:\nType: ${type}\nProfile: ${profileStr}\nAnswers: ${answersStr}\nPrompt:\n${prompt}`);

  const model = getModel();
  if (!model) {
    console.log("GEMINI FALLBACK ACTIVATED");
    return generateFallbackSummary(type, profile);
  }

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    devLog(`\nAI Summary Response:\n${text}\n`);

    const parsed = parseJson(text);
    if (
      parsed &&
      typeof parsed.summary === "string" &&
      Array.isArray(parsed.strengths) &&
      Array.isArray(parsed.weaknesses) &&
      typeof parsed.recommendation === "string"
    ) {
      return {
        summary: parsed.summary,
        strengths: parsed.strengths.filter((s) => typeof s === "string").slice(0, 5),
        weaknesses: parsed.weaknesses.filter((s) => typeof s === "string").slice(0, 5),
        recommendation: parsed.recommendation,
      };
    }

    console.log("GEMINI FALLBACK ACTIVATED");
    return generateFallbackSummary(type, profile);
  } catch (err) {
    console.log("GEMINI FALLBACK ACTIVATED");
    return generateFallbackSummary(type, profile);
  }
};

module.exports = { evaluateAnswer, generateSummary };

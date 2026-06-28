const env = require("../config/env");

const isDev = env.nodeEnv !== "production";
const devLog = (...args) => { if (isDev) console.log(...args); };

const STATUS_THRESHOLDS = [
  { status: "HOT", minScore: 80 },
  { status: "GOOD", minScore: 60 },
  { status: "MAYBE", minScore: 40 },
  { status: "LOW", minScore: 0 },
];

const clamp = (value, max) => Math.max(0, Math.min(value, max));

const getLeadStatus = (score) =>
  STATUS_THRESHOLDS.find((t) => score >= t.minScore).status;

const hasValue = (text, min = 1) =>
  typeof text === "string" && text.trim().length >= min;

const aiPoints = (quality, maxPoints) =>
  Math.round((quality / 10) * maxPoints);

const scoreFounder = (profile, linkedIn, aiScores = {}) => {
  const breakdown = [];

  const background = aiScores.background ?? null;
  const problem = aiScores.problem ?? null;
  const startupDescription = aiScores.startupDescription ?? null;
  const customer = aiScores.customer ?? null;
  const traction = aiScores.traction ?? null;
  const validationEvidence = aiScores.validationEvidence ?? null;
  const useOfFunds = aiScores.useOfFunds ?? null;

  breakdown.push({
    criterion: "Founder Background",
    maxPoints: 15,
    points: background !== null
      ? (background.meaningful ? aiPoints(background.quality, 15) : 0)
      : (hasValue(profile.background, 30) ? 8 : 0),
    reason: background?.reason ?? "Background and experience.",
  });

  breakdown.push({
    criterion: "Problem Clarity",
    maxPoints: 15,
    points: problem !== null
      ? (problem.meaningful ? aiPoints(problem.quality, 15) : 0)
      : (hasValue(profile.problem, 30) ? 8 : 0),
    reason: problem?.reason ?? "Problem statement quality.",
  });

  breakdown.push({
    criterion: "Startup Description",
    maxPoints: 10,
    points: startupDescription !== null
      ? (startupDescription.meaningful ? aiPoints(startupDescription.quality, 10) : 0)
      : (hasValue(profile.startupDescription, 20) ? 5 : 0),
    reason: startupDescription?.reason ?? "Startup concept clarity.",
  });

  breakdown.push({
    criterion: "Target Customer",
    maxPoints: 10,
    points: customer !== null
      ? (customer.meaningful ? aiPoints(customer.quality, 10) : 0)
      : (hasValue(profile.customer, 20) ? 5 : 0),
    reason: customer?.reason ?? "Customer segment definition.",
  });

  let mvpPoints = 0;
  let mvpReason = "";
  if (profile.mvpStatus === "COMPLETED") {
    mvpPoints = 15;
    mvpReason = "Live MVP demonstrates product maturity.";
  } else if (profile.mvpStatus === "IN_PROGRESS") {
    mvpPoints = 9;
    mvpReason = "MVP in progress shows active development.";
  } else {
    mvpPoints = 3;
    mvpReason = "Idea stage — no product built yet.";
  }
  if (hasValue(profile.mvpLink, 10)) mvpPoints += 5;

  breakdown.push({
    criterion: "MVP",
    maxPoints: 20,
    points: clamp(mvpPoints, 20),
    reason: mvpReason,
  });

  const tractionScore = traction !== null
    ? (traction.meaningful ? aiPoints(traction.quality, 15) : 0)
    : (hasValue(profile.traction, 20) ? 8 : 0);
  const tractionReason = traction?.reason ?? "Customer, revenue, or growth signals.";

  breakdown.push({
    criterion: "Traction",
    maxPoints: 15,
    points: clamp(tractionScore, 15),
    reason: tractionReason,
  });

  let teamPoints = 0;
  if (profile.teamSize >= 5) teamPoints += 7;
  else if (profile.teamSize >= 2) teamPoints += 5;
  else teamPoints += 2;
  if (profile.teamFullTime === "YES") teamPoints += 8;
  else if (profile.teamFullTime === "PARTIAL") teamPoints += 4;
  else teamPoints += 1;

  breakdown.push({
    criterion: "Team",
    maxPoints: 15,
    points: clamp(teamPoints, 15),
    reason: "Team size and commitment.",
  });

  const validationScore = validationEvidence !== null
    ? (validationEvidence.meaningful ? aiPoints(validationEvidence.quality, 18) : 0)
    : (hasValue(profile.validationEvidence, 30) ? 10 : 0);
  const notableBonus = hasValue(profile.notableBacking, 10) ? 2 : 0;

  breakdown.push({
    criterion: "Validation",
    maxPoints: 20,
    points: clamp(validationScore + notableBonus, 20),
    reason: validationEvidence?.reason ?? "Market validation evidence.",
  });

  let fundingPoints = 0;
  if (profile.fundingAsk > 0) fundingPoints += 5;
  if (hasValue(profile.fundingStage)) fundingPoints += 2;
  if (useOfFunds !== null) {
    fundingPoints += useOfFunds.meaningful ? aiPoints(useOfFunds.quality, 8) : 0;
  } else {
    fundingPoints += hasValue(profile.useOfFunds, 20) ? 4 : 0;
  }

  breakdown.push({
    criterion: "Funding",
    maxPoints: 15,
    points: clamp(fundingPoints, 15),
    reason: useOfFunds?.reason ?? "Clarity of funding ask and use of capital.",
  });

  let credibility = 0;
  if (hasValue(linkedIn)) credibility += 2;
  if (hasValue(profile.companyName)) credibility += 2;
  if (hasValue(profile.role)) credibility += 1;

  breakdown.push({
    criterion: "Credibility",
    maxPoints: 5,
    points: credibility,
    reason: "LinkedIn, company name, and role presence.",
  });

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);

  return { total, status: getLeadStatus(total), breakdown };
};

const scoreInvestor = (profile, linkedIn, aiScores = {}) => {
  const breakdown = [];

  const investmentThesis = aiScores.investmentThesis ?? null;
  const sectors = aiScores.sectors ?? null;
  const currentPortfolio = aiScores.currentPortfolio ?? null;
  const supportModel = aiScores.supportModel ?? null;

  const thesisScore = investmentThesis !== null
    ? (investmentThesis.meaningful ? aiPoints(investmentThesis.quality, 20) : 0)
    : (hasValue(profile.investmentThesis, 40) ? 10 : 0);

  breakdown.push({
    criterion: "Investment Thesis",
    maxPoints: 20,
    points: clamp(thesisScore, 20),
    reason: investmentThesis?.reason ?? "Clarity of investment thesis.",
  });

  const sectorsScore = sectors !== null
    ? (sectors.meaningful ? aiPoints(sectors.quality, 10) : 0)
    : (hasValue(profile.sectors, 10) ? 5 : 0);

  breakdown.push({
    criterion: "Sector Focus",
    maxPoints: 10,
    points: clamp(sectorsScore, 10),
    reason: sectors?.reason ?? "Sector and market focus.",
  });

  let stagePoints = 0;
  if (hasValue(profile.stageFocus)) stagePoints += 5;
  if (profile.leadOrFollow === "LEAD") stagePoints += 5;
  else if (profile.leadOrFollow === "BOTH") stagePoints += 4;
  else stagePoints += 2;

  breakdown.push({
    criterion: "Investment Style",
    maxPoints: 10,
    points: clamp(stagePoints, 10),
    reason: "Stage focus and round participation preference.",
  });

  let capitalPoints = 0;
  if (profile.capitalAvailable === "AVAILABLE") capitalPoints += 8;
  else if (profile.capitalAvailable === "LIMITED") capitalPoints += 5;
  else capitalPoints += 2;
  if (profile.chequeSize > 0) capitalPoints += 4;
  if (hasValue(profile.chequeRange)) capitalPoints += 3;
  if (profile.deploymentTimeline === "ONE_WEEK") capitalPoints += 5;
  else if (profile.deploymentTimeline === "TWO_TO_FOUR_WEEKS") capitalPoints += 4;
  else if (profile.deploymentTimeline === "ONE_TO_THREE_MONTHS") capitalPoints += 2;
  else capitalPoints += 1;

  breakdown.push({
    criterion: "Capital Readiness",
    maxPoints: 20,
    points: clamp(capitalPoints, 20),
    reason: "Capital availability, cheque size, and deployment speed.",
  });

  const portfolioScore = currentPortfolio !== null
    ? (currentPortfolio.meaningful ? aiPoints(currentPortfolio.quality, 15) : 0)
    : (hasValue(profile.currentPortfolio, 20) ? 8 : 0);

  breakdown.push({
    criterion: "Portfolio Quality",
    maxPoints: 15,
    points: clamp(portfolioScore, 15),
    reason: currentPortfolio?.reason ?? "Relevant portfolio and network value.",
  });

  const supportScore = supportModel !== null
    ? (supportModel.meaningful ? aiPoints(supportModel.quality, 15) : 0)
    : (hasValue(profile.supportModel, 30) ? 8 : 0);
  let handsonBonus = 0;
  if (profile.handsOnLevel === "VERY_HANDS_ON") handsonBonus = 4;
  else if (profile.handsOnLevel === "MODERATE") handsonBonus = 2;
  if (profile.dealsPerYear > 5) handsonBonus += 1;

  breakdown.push({
    criterion: "Founder Support",
    maxPoints: 20,
    points: clamp(supportScore + handsonBonus, 20),
    reason: supportModel?.reason ?? "Post-investment support model.",
  });

  let credibility = 0;
  if (hasValue(linkedIn)) credibility += 2;
  if (hasValue(profile.firmName)) credibility += 2;
  if (hasValue(profile.roleAtFirm)) credibility += 2;
  if (profile.chequeSize > 0) credibility += 2;
  if (profile.dealsPerYear > 0) credibility += 2;

  breakdown.push({
    criterion: "Credibility",
    maxPoints: 10,
    points: clamp(credibility, 10),
    reason: "LinkedIn, firm name, role, and deal history.",
  });

  const total = breakdown.reduce((sum, item) => sum + item.points, 0);

  return { total, status: getLeadStatus(total), breakdown };
};

const calculateLeadScore = (leadData, aiScores = {}) => {
  devLog(`\nScoring Request:\nType: ${leadData.type}\nProfile: ${JSON.stringify(leadData.type === "FOUNDER" ? leadData.founder : leadData.investor, null, 2)}\nAI Scores: ${JSON.stringify(aiScores, null, 2)}`);

  const result = leadData.type === "FOUNDER"
    ? scoreFounder(leadData.founder, leadData.linkedIn, aiScores)
    : scoreInvestor(leadData.investor, leadData.linkedIn, aiScores);

  devLog(`\nFinal Score:\n${result.total}`);
  devLog(`\nFinal Status:\n${result.status}\n`);

  return result;
};

module.exports = { calculateLeadScore, getLeadStatus };

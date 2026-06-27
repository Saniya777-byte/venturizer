function calculateFounderScore(founder, linkedIn) {
  let score = 0;

  if (founder.mvpStatus === "COMPLETED") score += 20;
  else if (founder.mvpStatus === "IN_PROGRESS") score += 10;

  if (founder.teamSize >= 2) score += 15;

  if (founder.traction) score += 20;

  if (founder.validationEvidence) score += 15;

  if (founder.fundingAsk > 0) score += 10;

  if (linkedIn) score += 5;

  return score;
}

function getLeadStatus(score) {
  if (score >= 80) return "HOT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "MAYBE";
  return "LOW";
}

module.exports = {
  calculateFounderScore,
  getLeadStatus,
};
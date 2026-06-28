const dashboardService = require("../services/dashboard.service");

const getDashboard = async (req, res) => {
  const dashboard = await dashboardService.getDashboard();

  res.json({
    success: true,
    data: dashboard,
  });
};

module.exports = {
  getDashboard,
};

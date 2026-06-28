const prisma = require("../database/prisma");

const toDateKey = (date) => date.toISOString().slice(0, 10);

const getDashboard = async () => {
  const since = new Date();
  since.setDate(since.getDate() - 29);
  since.setHours(0, 0, 0, 0);

  const [totalLeads, typeCounts, statusCounts, aggregate, recentSubmissions, activityLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.groupBy({
        by: ["type"],
        _count: { _all: true },
      }),
      prisma.lead.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      prisma.lead.aggregate({
        _avg: { score: true },
      }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          founder: true,
          investor: true,
          aiSummary: true,
        },
      }),
      prisma.lead.findMany({
        where: {
          createdAt: {
            gte: since,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

  const typeMap = Object.fromEntries(
    typeCounts.map((item) => [item.type, item._count._all])
  );
  const statusMap = Object.fromEntries(
    statusCounts.map((item) => [item.status, item._count._all])
  );
  const dailyMap = activityLeads.reduce((map, lead) => {
    const key = toDateKey(lead.createdAt);
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());

  return {
    totals: {
      totalLeads,
      founders: typeMap.FOUNDER || 0,
      investors: typeMap.INVESTOR || 0,
      hot: statusMap.HOT || 0,
      good: statusMap.GOOD || 0,
      maybe: statusMap.MAYBE || 0,
      low: statusMap.LOW || 0,
      averageScore: Math.round(aggregate._avg.score || 0),
    },
    recentSubmissions,
    latestActivity: recentSubmissions,
    charts: {
      byType: typeCounts.map((item) => ({
        label: item.type,
        value: item._count._all,
      })),
      byStatus: statusCounts.map((item) => ({
        label: item.status,
        value: item._count._all,
      })),
      dailySubmissions: Array.from(dailyMap, ([date, count]) => ({ date, count })),
    },
  };
};

module.exports = {
  getDashboard,
};

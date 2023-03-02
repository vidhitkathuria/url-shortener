const shortid = require("shortid");
const URL = require("../models/url");
const cron = require("node-cron");

const handleGenerateNewShortURL = async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
};

const handleGetAnalytics = async (req, res) => {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

//

// Run the task every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("cron running ---");
  const now = new Date();
  const thirtyDaysBack = new Date(now.setDate(now.getDate()));

  console.log(thirtyDaysBack);

  // Delete documents that are older than 30 days
  await URL.deleteMany({ expiration: { $lt: thirtyDaysBack } });
  console.log("deleted using cron");
});

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};

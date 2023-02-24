const shortid = require("shortid");
const URL = require("../models/url");
const cron = require("node-cron");
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

//

// Run the task every day at midnight
cron.schedule("0 0 * * *", async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Delete documents that are older than 30 days
  await ShortUrl.deleteMany({ created: { $lt: thirtyDaysAgo } });
});

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};

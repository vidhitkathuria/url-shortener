const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const userRoutes = require("./routes/user");

require("dotenv").config();
const URL = require("./models/url");

const app = express();
const cors = require("cors");
app.use(cors());
connectToMongoDB(process.env.MONGO_URI).then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);
app.use("/api/users", userRoutes);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
      expiration: new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
    }
  );
  res.redirect(entry.redirectURL);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

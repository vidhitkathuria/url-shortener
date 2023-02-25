const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamp: { type: Number } }],
    expiration: {
      type: Date,
      default: Date.now() + (60 * 60 * 24 * 30 * 1000)
    },
  },

  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;

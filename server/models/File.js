const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    expire_at: { type: Date, default: Date.now, expires: 20 },
    name: {
      type: String,
    },
    content: {
      type: Buffer,
      contentType: String,
    },
    hash: {
      type: String,
    },
    type: {
      type: String,
    },
    size: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", FileSchema);

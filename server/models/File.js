const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    expire_at: { type: Date, default: new Date(Date.now() + 12096e5) }, // Delete the file after 14 days
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

const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
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

const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Accepted", "Rejected"],
    },
    type: {
      type: String,
      enum: ["Block", "Unblock"],
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);

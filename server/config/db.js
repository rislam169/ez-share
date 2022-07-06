const mongoose = require("mongoose");
const File = require("../models/File");
const Request = require("../models/Request");

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);

  console.log(`MongoDb Connected: ${conn.connection.host}`);
};

const getFile = async (fileId) => {
  const file = await File.findByIdAndUpdate(fileId, {
    $set: {
      expire_at: new Date(Date.now() + 12096e5), // File will be deleted after 14 days if not downloaded
    },
  }).then((data) => {
    return data;
  });
  return file;
};

const addFile = async (fileData) => {
  return await File.create(fileData);
};

const updateFileStatus = async (fileId, status) => {
  const file = await File.findByIdAndUpdate(fileId, {
    $set: {
      status: status,
    },
  });
  return file;
};

const updateRequestStatus = async (requestId, status) => {
  const request = await Request.findByIdAndUpdate(requestId, {
    $set: {
      status: status,
    },
  });
  return request;
};

module.exports = {
  connectDB,
  addFile,
  getFile,
  updateFileStatus,
  updateRequestStatus,
};

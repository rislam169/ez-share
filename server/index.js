const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
require("dotenv").config();
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const {
  connectDB,
  getFile,
  updateFileStatus,
  addFile,
} = require("./config/db");
const {
  returnResponse,
  blockFile,
  unblockFile,
  prepareFileData,
} = require("./helpers/utils");
const port = process.env.PORT || 5000;

const app = express();

//Connect to database
connectDB();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

// Block a file
app.post("/block", function (req, res) {
  if (!req.body.fileId || !req.body.requestId) {
    returnResponse(
      false,
      "File id or request id not found in the request",
      res
    );
  }

  getFile(req.body.fileId).then((file) => {
    if (file) {
      blockFile(file.hash).then((isBlocked) => {
        if (isBlocked) {
          updateFileStatus(file.id, "Blocked").then((file) => {
            if (file) {
              returnResponse(true, "File is now blocked successfully!", res);
            } else {
              returnResponse(
                false,
                "File is not blocked! Please try again",
                res
              );
            }
          });
        }
      });
    } else {
      returnResponse(false, "File Not Found!", res);
    }
  });
});

// Unblock a file
app.post("/unblock", function (req, res) {
  if (!req.body.fileId || !req.body.requestId) {
    returnResponse(
      false,
      "File id or request id not found in the request",
      res
    );
  }

  getFile(req.body.fileId).then((file) => {
    if (file) {
      unblockFile(file.hash).then((isUnblocked) => {
        if (isUnblocked) {
          updateFileStatus(file.id, "Unblocked").then((file) => {
            if (file) {
              returnResponse(true, "File is now unblocked successfully!", res);
            } else {
              returnResponse(
                false,
                "File is not unblocked! Please try again",
                res
              );
            }
          });
        }
      });
    } else {
      returnResponse(false, "File Not Found!", res);
    }
  });
});

// Upload a file
app.post("/upload", async function (req, res) {
  if (!req.files) {
    returnResponse(false, "Files not found in the request", res);
  } else {
    const fileData = prepareFileData(req.files.file);

    addFile(fileData).then((file) => {
      if (file) {
        returnResponse(true, "File uploaded successfully!", res, {
          fileId: file.id,
        });
      } else {
        returnResponse(false, "File is not blocked! Please try again", res);
      }
    });
  }
});

// Download a file
app.post("/file/download/:fileId", function (req, res) {
  getFile(req.params.fileId).then((file) => {
    if (file) {
      res.contentType(file.type);
      res.send(file.content);
      res.end();
    } else {
      returnResponse(false, "File Not Found!", res);
    }
  });
});

app.listen(port, console.log(`Server is running on ${port}`));

const FormData = require("form-data");
const RequestPromise = require("request-promise").defaults({ jar: true });
const cheerio = require("cheerio");
const crypto = require("crypto");
const mongodb = require("mongodb");
const blockListUrl = "https://www.tu-chemnitz.de/informatik/DVS/blocklist/";

const returnResponse = (statusCode, status, message, res, data = {}) => {
  res
    .status(statusCode)
    .send(JSON.stringify({ status: status, message, data }));
  res.end();
};

const responseSuccess = (message, res) => {
  res.status(201).write(JSON.stringify({ status: true, message }));
  res.end();
};

const b2h = (buffer) => {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
};

const blockFile = async (fileHash) => {
  const isBlocked = await checkBlockStatus(fileHash);
  if (!isBlocked) {
    try {
      const blockRequest = await RequestPromise.put(blockListUrl + fileHash, {
        resolveWithFullResponse: true,
      });
      return blockRequest.statusCode === 201;
    } catch (error) {
      console.log(31);
      console.log(error.statusCode);
    }
  } else {
    return true;
  }
};

const unblockFile = async (fileHash) => {
  const isBlocked = await checkBlockStatus(fileHash);
  if (isBlocked) {
    try {
      const blockRequest = await RequestPromise.delete(
        blockListUrl + fileHash,
        {
          resolveWithFullResponse: true,
        }
      );
      return blockRequest.statusCode === 204;
    } catch (error) {
      console.log(48);
      console.log(error.statusCode);
    }
  } else {
    return true;
  }
};

const login = async () => {
  //Request 1
  //Get entityId from response html
  response = await RequestPromise.get(blockListUrl);

  //Request 2
  //Url: https://wtc.tu-chemnitz.de/shibboleth/WAYF
  //Reponse cookie: _saml_sp
  let $ = cheerio.load(response);
  const form = $("#KrbIdP");

  let url = decodeURIComponent(
    "https://wtc.tu-chemnitz.de" + form.attr("action")
  );

  response = await RequestPromise.get(url);

  //Request 3
  //Url: https://wtc.tu-chemnitz.de/shibboleth/WAYF
  //Request cookie: _saml_sp
  //Response cookie: _saml_sp, _saml_idp, _redirect_user_idp, _redirection_state
  response = await RequestPromise.post(url);

  //Request 4
  url =
    decodeURIComponent(form.attr("action").split("return=")[1]) +
    "&entityID=" +
    encodeURIComponent("https://wtc.tu-chemnitz.de/shibboleth");

  let AuthState = "";
  try {
    response = await RequestPromise.get(url);
  } catch (error) {
    let response = error.message;

    AuthState = response.substring(
      response.indexOf("AuthState") + 10,
      response.indexOf("here") - 3
    );
    AuthState = decodeURIComponent(AuthState);

    url = response.substring(
      response.indexOf("href=") + 7,
      response.indexOf("here") - 3
    );
  }

  //Request 5
  response = await RequestPromise.get(url);

  //Request 6
  const usernameFormData = new FormData();
  usernameFormData.append("username", "imdr");
  usernameFormData.append("remember_username", "Yes");
  usernameFormData.append("AuthState", AuthState);

  try {
    await RequestPromise.post(
      "https://wtc.tu-chemnitz.de/krb/module.php/TUC/username.php?",
      {
        form: {
          username: "imdr",
          remember_username: "Yes",
          AuthState: AuthState,
        },
      }
    );
  } catch (error) {
    console.log("username done");
  }

  //Request 7
  const passwordFormData = new FormData();
  passwordFormData.append("password", "R15115302Qzoom$");
  passwordFormData.append("AuthState", AuthState);

  response = await RequestPromise.post(
    "https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php?",
    {
      form: { password: "R15115302Qzoom$", AuthState: AuthState },
    }
  );

  //   Request 8
  $ = cheerio.load(response);
  const SAMLResponse = $("input[name='SAMLResponse']").attr("value");
  try {
    await RequestPromise.post(
      "https://www.tu-chemnitz.de/Shibboleth.sso/SAML2/POST",
      {
        form: { SAMLResponse: SAMLResponse },
      }
    );
  } catch (error) {
    console.log("SAML Done", error.statusCode);
  }
};

const checkBlockStatus = async (fileHash) => {
  try {
    const blocklistCheckRequest = await RequestPromise.get(
      blockListUrl + fileHash,
      {
        resolveWithFullResponse: true,
      }
    );

    if (
      blocklistCheckRequest.toJSON().request.uri.pathname === "/shibboleth/WAYF"
    ) {
      await login();
      return checkBlockStatus(fileHash);
    } else if (
      blocklistCheckRequest.toJSON().request.uri.pathname ===
      `/informatik/DVS/blocklist/${fileHash}`
    ) {
      return blocklistCheckRequest.statusCode === 210;
    }

    // return false;
  } catch (error) {
    console.log("182");
    console.log(error.statusCode);
    return false;
  }
};

const prepareFileData = (file) => {
  //create file sha-256 hashcode
  const hash = crypto.createHash("sha256");
  const fileHash = hash.update(file.data).digest("hex");
  const binary = mongodb.Binary;

  return {
    name: file.name,
    content: new Buffer.from(file.data, "base64"),
    hash: fileHash,
    size: file.size / 1000,
    type: file.mimetype,
    status: "Unblocked",
  };
};

module.exports = {
  returnResponse,
  b2h,
  blockFile,
  unblockFile,
  prepareFileData,
};

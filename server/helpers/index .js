// const request = require("request-promise");
var FormData = require("form-data");
const cheerio = require("cheerio");
let request = require("request-promise").defaults({ jar: true });
// const cookieJar = request.jar();
// request = request.defaults({ jar: cookieJar });

async function main() {
  //Request 0
  const result = await request.get(
    "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"
  );
  let $ = cheerio.load(result);
  const form = $("#KrbIdP");

  let loginUrl = decodeURIComponent(
    "https://wtc.tu-chemnitz.de" + form.attr("action")
  );

  //Request 1
  const result2 = await request.get(loginUrl);
  // let cookieString = cookieJar.getCookieString(loginUrl);
  // const _saml_sp = cookieString.split("_saml_sp=")[1];

  //Request 2
  // let cookieJar2 = request.jar();
  // cookieJar2.setCookie(JSON.stringify({ _saml_sp: _saml_sp }), loginUrl);
  // request = request.defaults({ jar: cookieJar2 });
  const cookieJar2 = request.jar();
  request.defaults({ jar: cookieJar2 });
  const result3 = await request.post(loginUrl);
  // const cookieJar = request.jar();
  // console.log(cookieJar2.getCookieString(loginUrl));

  // return false;
  // cookieString = cookieJar2.getCookieString(loginUrl);
  // console.log(cookieJar2);
  // return false;

  // const cookieString = cookieJar.getCookieString(loginUrl);
  // const splittedByCookie = cookieString.split("_saml_sp=")[1];

  //   console.log(cookieString);

  loginUrl =
    decodeURIComponent(form.attr("action").split("return=")[1]) +
    "&entityID=" +
    encodeURIComponent("https://wtc.tu-chemnitz.de/shibboleth");

  //   return false;
  //   let cookie = {
  //     _saml_idp: splittedByCookie,
  //     _saml_sp: splittedByCookie,
  //     _redirect_user_idp: "https://wtc.tu-chemnitz.de/shibboleth",
  //     _redirection_state: "checked",
  //   };
  //   console.log(cookie);
  //   let cookiejar = request.jar();
  //   cookiejar.setCookie(JSON.stringify(cookie), "https://wtc.tu-chemnitz.de");
  //   console.log(cookiejar);
  let AuthState = "";
  try {
    const result4 = await request.get(loginUrl);
  } catch (error) {
    let response = error.message;

    AuthState = response.substring(
      response.indexOf("AuthState") + 10,
      response.indexOf("here") - 3
    );
    AuthState = decodeURIComponent(AuthState);

    loginUrl = response.substring(
      response.indexOf("href=") + 7,
      response.indexOf("here") - 3
    );
    // console.log(loginUrl);
  }

  const result5 = await request.get(loginUrl);

  $ = cheerio.load(result5);
  loginUrl = $("#tucal-topbar").find("a").attr("href");

  const usernameFormData = new FormData();
  usernameFormData.append("username", "imdr");
  usernameFormData.append("remember_username", "Yes");
  usernameFormData.append("AuthState", AuthState);

  try {
    const result6 = await request.post(
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

  // console.log(AuthState);

  // try {
  //   const captcha = await request.get(
  //     `https://wtc.tu-chemnitz.de/krb/module.php/TUC/captcha.php?AuthState=${AuthState}`
  //   );
  // } catch (error) {
  //   console.log("captcha done");
  // }

  // try {
  //   const result7 = await request.get(
  //     `https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php?AuthState=${AuthState}`
  //   );
  // } catch (error) {
  //   console.log("done");
  // }

  const passwordFormData = new FormData();
  passwordFormData.append("password", "R15115302Qzoom$");
  passwordFormData.append("AuthState", AuthState);

  const result8 = await request.post(
    "https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php?",
    {
      form: { password: "R15115302Qzoom$", AuthState: AuthState },
    }
  );

  // const result9 = await request.post({
  //   url: `https://www.tu-chemnitz.de/Shibboleth.sso/SAML2/POST`,
  // });

  $ = cheerio.load(result8);
  SAMLResponse = $("input[name='SAMLResponse']").attr("value");

  // samlRequestUrl send
  try {
    const samlRequest = await request.post(
      "https://www.tu-chemnitz.de/Shibboleth.sso/SAML2/POST",
      {
        form: { SAMLResponse: SAMLResponse },
      }
    );
  } catch (error) {
    console.log("SAML Done");
  }

  try {
    const blocklistCheckRequest = await request.get(
      "https://www.tu-chemnitz.de/informatik/DVS/blocklist/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      {
        resolveWithFullResponse: true,
      }
    );
    console.log("blocklistCheckRequest");
    console.log(blocklistCheckRequest.statusCode);
  } catch (error) {
    console.log("error");
    console.log(error);
  }

  //   const cookieString = cookieJar.getCookieString(
  //     "https://www.tu-chemnitz.de/informatik/DVS/blocklist/"
  //   );

  //   console.log(cookiejar);
  //   console.log(result4);

  //   const button = $("#redirect");
  //   console.log(button.attr("href"));
  //   https://wtc.tu-chemnitz.de/shibboleth/WAYF?entityID=https://www.tu-chemnitz.de/shibboleth&return=https://www.tu-chemnitz.de/Shibboleth.sso/Login?SAMLDS=1&target=ss%3Amem%3Ac57a73389b92ed0d405e17fe64dc831583dafb699db5506b907c300739d19ca6
}

main();

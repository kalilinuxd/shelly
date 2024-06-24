const axios = require("axios");
const fs = require("fs-extra");
global.Grykj = async function getStreamFromURL(url = "", pathName = "", options = {}) {
  if (!options && typeof pathName === "object") {
    options = pathName;
    pathName = "";
  }
  try {
    if (!url || typeof url !== "string")
      throw new Error(`The first argument (url) must be a string`);
    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
      ...options
    });
    if (!pathName)
      pathName = Mods.randomString(10) + (response.headers["content-type"] ? '.' + Mods.getExtFromMimeType(response.headers["content-type"]) : ".noext");
    response.data.path = pathName;
    return response.data;
  }
  catch (err) {
    throw err;
  }
        }

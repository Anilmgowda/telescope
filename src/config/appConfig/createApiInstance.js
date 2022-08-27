import commonApiList from "./baseUrl";
import appConfig from "@appConfig";

const host = window.location.protocol + "//" + window.location.host;
const env =
  host && host.includes("orionui-dev")
    ? "STAGING"
    : host &&
      (host.includes("orionui-prod") ||
        host.includes("orion.telescopepartners.com") ||
        host.includes("orion.telescope.vc"))
    ? "PROD"
    : "DEV";
let SERVER_ADDRESS = (SERVER_ADDRESS = appConfig.api[env].SERVER_ADDRESS);

function createApiInstance(type) {
  const apiList = commonApiList;
  const url = apiList[type];
  const baseURL = SERVER_ADDRESS + url;
  return {
    baseURL,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  };
}

export default createApiInstance;

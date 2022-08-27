import axios from "axios";
import appConfig from "@appConfig";
import * as actionTypes from "../actionTypes";
import { history } from "../../config";

const host = window.location.protocol + "//" + window.location.host;
let redirectURL;
if (
  host.includes("orion.telescope.vc") ||
  host.includes("orion.telescopepartners.com")
) {
  redirectURL = host.includes("orion.telescope.vc")
    ? "https://orion.telescope.vc/login"
    : host.includes("orion.telescopepartners.com")
    ? "https://orion.telescopepartners.com/login"
    : "";
} else {
  const env =
    host && host.includes("orionui-dev")
      ? "STAGING"
      : host && host.includes("orionui-prod")
      ? "PROD"
      : "DEV";
  redirectURL = appConfig.redirect_uri[env].CALLBACK_URL;
}

export const checkAuth = (currentPath) => (dispatch) => {
  const authData = localStorage.getItem("authData");
  if (authData) {
    dispatch(loginAction(authData));
  } else {
    history.push("/login");
  }
};

const loginAction = (data) => ({
  type: actionTypes.SET_LOGIN,
  data,
});

export const initializeLogout = () => (dispatch) => {
  dispatch(logoutAction());
};
const logoutAction = () => ({
  type: actionTypes.SET_LOGOUT,
});

export const getAccessTokenReq = (code) => (dispatch) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", `${code}`);
  params.append("redirect_uri", `${redirectURL}`);
  params.append("client_id", "4lq9qj2uf363q0d1vav5nrdg1h");
  params.append(
    "client_secret",
    "15cvcvnh7j2joe159tdfu1uoeqc344vudqis6liv5rhivsmrhg8"
  );
  return axios
    .post(
      `https://orion-portal.auth.us-east-1.amazoncognito.com/oauth2/token`,
      params
    )
    .then((res) => {
      dispatch(loginAction(res.data.id_token));
      localStorage.setItem("authData", res.data.id_token);
      localStorage.setItem("accessToken", res.data.access_token);
      return { status: "success" };
    });
};

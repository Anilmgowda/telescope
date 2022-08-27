import React from "react";
import appConfig from "@appConfig";
import "./oauth.scss"



const host = window.location.protocol + "//" + window.location.host;
let redirectURL;
if(host.includes("orion.telescope.vc") || host.includes("orion.telescopepartners.com")) {
  redirectURL = host.includes("orion.telescope.vc") ? "https://orion.telescope.vc/login" : host.includes("orion.telescopepartners.com") ? "https://orion.telescopepartners.com/login" : ""
} else {
  const env = host && host.includes("orionui-dev") ? "STAGING" :  host && host.includes("orionui-prod") ? "PROD" : "DEV"
   redirectURL = appConfig.redirect_uri[env].CALLBACK_URL  
}

const Oauth = () => {
  return (
    <div className="app">
      <div className="anchor-box d-flex justify-content-center align-items-center">
        <a href={`https://orion-portal.auth.us-east-1.amazoncognito.com/login?client_id=4lq9qj2uf363q0d1vav5nrdg1h&response_type=code&scope=email+openid&redirect_uri=${redirectURL}`}>Log in with Google</a>
      </div>
    </div>
  );
}
export { Oauth }
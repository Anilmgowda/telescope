import appConfig from "@appConfig";

export const getAddress = () => {
    const host = window.location.protocol + "//" + window.location.host;
    const env = host && host.includes("orionui-dev") ? "STAGING" : host && (host.includes("orionui-prod") || host.includes("orion.telescopepartners.com") || host.includes("orion.telescope.vc")) ? "PROD" : "DEV"
    let SERVER_ADDRESS = appConfig.api[env].SERVER_ADDRESS
    return SERVER_ADDRESS;
}

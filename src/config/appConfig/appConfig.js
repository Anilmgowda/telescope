const appConfig = {
    appName: "Orion",
    // appLogo: require("../../res/images/logo.png"),
    poweredby: "",
    api: {
        DEV: {
            SERVER_ADDRESS: 'https://orion-portal-backend-staging.herokuapp.com/api/v1',
        },
        STAGING: {
            SERVER_ADDRESS: 'https://orion-portal-backend-staging.herokuapp.com/api/v1',
        },
        PROD: {
            SERVER_ADDRESS: 'https://orion-portal-backend-prod.herokuapp.com/api/v1',
        }
    },
    redirect_uri: {
        DEV: {
            CALLBACK_URL: "http://localhost:3000/login"
        },
        STAGING: {
            CALLBACK_URL: "https://orionui-dev.herokuapp.com/login"
        },
        PROD: {
            CALLBACK_URL: "https://orionui-prod.herokuapp.com/login"
        }
    }

}
export default appConfig;
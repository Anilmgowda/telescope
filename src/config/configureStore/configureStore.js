import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

function configureStore(initialState) {
  const webpackEnv = process.env.NODE_ENV;
  const isEnvDevelopment = webpackEnv === "development";
  // const isEnvProduction = webpackEnv === "production";
  //for redux devtools
  // if required redux dev tools can be shown in dev environment
  // when running from server using this env variable
  // const showReduxDevTools = process.env.REACT_APP_REDUX_DEV_TOOLS !== "false";
  const devTools =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const composeEnhancers = isEnvDevelopment
    ? devTools
    : compose;

  const store = createStore(
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
}

export { configureStore };

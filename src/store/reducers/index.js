import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { referenceReducer } from "./referencesReducer";
import { commonReducer } from "./commonReducer";
import { dashBoardReducer, companyUpdateReducer } from "./dashboardReducer";
import { submissionsReducer } from "./submissionsReducer";
import { discoveryReducer } from "./discoveryReducer";
import { companyProfileReducer } from "./companyProfileReducer";

export default combineReducers({
  authReducer,
  dashBoardReducer,
  referenceReducer,
  commonReducer,
  submissionsReducer,
  companyUpdateReducer,
  discoveryReducer,
  companyProfileReducer,
});

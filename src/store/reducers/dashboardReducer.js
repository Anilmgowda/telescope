import * as actionTypes from "../actionTypes";

const notificationsData = [
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
  {
    name: "Company Name",
    details:
      "Company Y has posted a new Job on linked in for the role Vice President.",
  },
];

const INITIAL_STATE = {
  companyupdate: null,
  filterUpdate: null,
  notification: [...notificationsData],
  reference: [...notificationsData],
  tpPipeline: {},
  filterType: null,
  userInfo: null,
  companyDataLoading: false,
  userInfo: null,
};

const dashBoardReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.GET_DASHBOARD_DETAILS:
      return {
        ...state,
      };
    case actionTypes.SET_TP_PIPELINE:
      return {
        ...state,
        tpPipeline: action.data,
      };
    case actionTypes.SET_LOGGED_IN_USER_INFO:
      return {
        ...state,
        userInfo: { ...action.data },
      };
    default:
      return state;
  }
};
const companyUpdateReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.COMPANY_UPDATE:
      return {
        ...state,
        companyupdate: { ...action.data },
      };
    case actionTypes.COMPANY_FILTER_UPDATE:
      return {
        ...state,
        filterUpdate: { ...action.data },
      };
    case actionTypes.COMPANY_UPDATE_LOADING:
      return {
        ...state,
        companyDataLoading: action.data,
      };
    case actionTypes.COMPANY_UPDATE_TYPE:
      return {
        ...state,
        filterType: { ...action.data },
      };

    default:
      return {
        ...state,
      };
  }
};

export { dashBoardReducer, companyUpdateReducer };

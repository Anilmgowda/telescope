import * as actionTypes from "../actionTypes";

const INITIAL_STATE = {
  referenceData: null,
  allReferences: {},
  emailHistory: null,
  searchResult: {},
  emailError: null,
  projects: []
};

const referenceReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.GET_REFERENCES:
      return {
        ...state,
        allReferences: action.data,
      };
    case actionTypes.SET_REFERENCES_SEARCH:
      let finalData = {};
      if (action.data?.isAppend) {
        finalData = {
          ...action.data,
          results: [...state?.searchResult?.results, ...action.data?.results],
        };
      } else {
        finalData = action.data;
      }
      return {
        ...state,
        searchResult: { ...finalData },
      };
    case actionTypes.GET_INVESTOR:
      return {
        ...state,
        allReferences: action.data,
      };
    case actionTypes.SET_INVESTOR_SEARCH:
      return {
        ...state,
        referenceData: { ...action.data },
      };
    case actionTypes.GET_EMAIL_HISTORY:
      return {
        ...state,
        emailHistory: action.data,
        allReferences: action.data,
      };
    case actionTypes.SET_EMAIL_ERROR:
      return {
        ...state,
        emailError: action.data,
      };
    case actionTypes.GET_TP_OWNER:
      return {
        ...state,
        allReferences: action.data,
      };
    case actionTypes.GET_TP_STATUS:
      return {
        ...state,
        allReferences: action.data,
      };
    case actionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: [...action.data],
      };
    case actionTypes.RESET_REFERENCES:
      let final = {
        results: [],
      };
      return {
        ...state,
        searchResult: {...final}
      };
    default:
      return {
        ...state,
      };
  }
};

export { referenceReducer };

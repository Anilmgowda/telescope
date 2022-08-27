import * as actionTypes from "../actionTypes";

const INITIAL_STATE = {
  scopers: [],
};
const commonReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_SCOPERS:
      return {
        ...state,
        scopers: action.data.data,
      };
    default:
      return {
        ...state,
      };
  }
};

export { commonReducer };

import * as actionTypes from '../actionTypes'

const INITIAL_STATE = {
  token: '',
}

const authReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_LOGIN:
      return {
        ...state,
        token:action.data,
      }
    case actionTypes.SET_LOGOUT:
      localStorage.removeItem("authData");
      return {
        ...INITIAL_STATE,
      }
    default:
      return state
  }
}

export { authReducer }

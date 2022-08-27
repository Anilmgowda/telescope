import * as actionTypes from '../actionTypes'

const INITIAL_STATE = {
  linkedinData: {},
  spyfuData: {},
  alexaData: {},
  filterSearchData: {}
}

const discoveryReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_LINKEDIN_METRICS:
      return {
        ...state,
        linkedinData: action.data,
      }
    case actionTypes.SET_SPYFU_METRICS:
      return {
        ...state,
        spyfuData: action.data,
      }
    case actionTypes.SET_ALEXA_METRICS:
      return {
        ...state,
        alexaData: action.data,
      }
    case actionTypes.SET_FILTER_METRICS:
      return {
        ...state,
        filterSearchData: action.data.data,
        selectedMatrices: action?.data?.selectedMatrices
      }
    case actionTypes.RESET_FILTER:
      return {
        ...INITIAL_STATE
      }
    default:
      return {
        ...state,
      }
  }
}

export { discoveryReducer }

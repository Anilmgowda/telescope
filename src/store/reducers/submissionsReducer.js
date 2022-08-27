import * as actionTypes from '../actionTypes'

const INITIAL_STATE = {
  template : {},
  fileMatrics : {},
  allTemplates: [],
  graphOption: {},
  tableData:[]
}

const submissionsReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SET_FILE_MATRICS_TEMPLATE:
      return {
        ...state,
        template: action.data.data,
      }
    case actionTypes.SET_FILE_MATRICS:
      return {
        ...state,
        fileMatrics: action.data,
      }
    case actionTypes.SET_COOKIE_STORE:
      return {
        ...state,
        fileMatrics: action.data,
      }
    case actionTypes.SET_TEMPLATES:
      return {
        ...state,
        allTemplates: action.data,
      }
    case actionTypes.SET_GRAPH_OPTION:
      return {
        ...state,
        graphOption: {...state?.graphOption, ...action.data}
      };
    case actionTypes.SET_TABLE:
      return {
        ...state,
        tableData: action.data
      };
    default:
      return {
        ...state,
      }
  }
}

export { submissionsReducer }

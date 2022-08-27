import * as actionTypes from "../actionTypes";

const INITIAL_STATE = {
  favResult: null,
  fileUploads: null,
  documentTypes: null,
  fileUploadStatus: null,
};
const companyProfileReducer = function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.COMPANY_PROFILE_FAVORITE:
      return {
        ...state,
        favResult: { ...action.data },
      };
    case actionTypes.COMPANY_PROFILE_FILE_UPLOADS:
      return {
        ...state,
        fileUploads: { ...action.data },
      };
    case actionTypes.COMPANY_PROFILE_DOCUMENT_TYPES:
      return {
        ...state,
        documentTypes: { ...action.data },
      };
    case actionTypes.COMPANY_PROFILE_FILE_UPLOADED:
      return {
        ...state,
        fileUploadStatus: { ...action.data },
      };
    case actionTypes.COMPANY_PROFILE_ALERT:
      return {
        ...state,
        companyAlerts: { ...action.data },
      };
    case actionTypes.COMPANY_PROFILE_FAVOURITE:
      return {
        ...state,
        companyFavourite: { ...action.data },
      };

    default:
      return {
        ...state,
      };
  }
};

export { companyProfileReducer };

import * as actionTypes from "../actionTypes";

export const getCompanyProfileFavorite =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "POST",
        data: { ...data },
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          dispatch(setCompanyProfileFav(res.data));
        })
        .catch((err) => {
          console.log("Company Updates response - error -> ", err);
          return { status: "failed" };
        });
    };

const setCompanyProfileFav = (data) => ({
  type: actionTypes.COMPANY_PROFILE_FAVORITE,
  data,
});
export const getCompanyProfileFileUploads =
  (axiosInstance, data) => (dispatch) => {
    return axiosInstance({
      method: "GET",
      params: { ...data },
      headers: {
        Authorization: localStorage.getItem("authData")
          ? "Bearer " + localStorage.getItem("authData")
          : null,
      },
    })
      .then((res) => {
        dispatch(setCompanyProfileFileUploads(res?.data));
      })
      .catch((err) => {
        console.log("Company File Uploads response - error -> ", err);
        return { status: "failed" };
      });
  };

const setCompanyProfileFileUploads = (data) => ({
  type: actionTypes.COMPANY_PROFILE_FILE_UPLOADS,
  data,
});

export const getCompanyProfileDocumentTypes =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "GET",
        params: { ...data },
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          dispatch(setCompanyProfileDocumentTypes(res?.data));
        })
        .catch((err) => {
          console.log("Company document types response - error -> ", err);
          return { status: "failed" };
        });
    };

const setCompanyProfileDocumentTypes = (data) => ({
  type: actionTypes.COMPANY_PROFILE_DOCUMENT_TYPES,
  data,
});

export const uploadFile =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "POST",
        data: data,
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          dispatch(setFileUploaded(res?.data));
        })
        .catch((err) => {
          console.log("Company document types response - error -> ", err);
          return { status: "failed" };
        });
    };

const setFileUploaded = (data) => ({
  type: actionTypes.COMPANY_PROFILE_FILE_UPLOADED,
  data,
});

export const getCompanyAlerts =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "GET",
        params: { ...data },
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          dispatch(setCompanyAlerts(res?.data));
        })
        .catch((err) => {
          dispatch(setCompanyAlerts({ error: true }));
          console.log("Companyc Alerts response - error -> ", err);
          return { status: "failed" };
        });
    };

const setCompanyAlerts = (data) => ({
  type: actionTypes.COMPANY_PROFILE_ALERT,
  data,
});

export const getCompanyFavourite =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "GET",
        params: { ...data },
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          dispatch(setCompanyFavourite(res?.data));
        })
        .catch((err) => {
          dispatch(setCompanyFavourite({ error: true }));
          console.log("Companyc Alerts response - error -> ", err);
          return { status: "failed" };
        });
    };

const setCompanyFavourite = (data) => ({
  type: actionTypes.COMPANY_PROFILE_FAVOURITE,
  data,
});

export const saveCompanyAlert =
  (axiosInstance, data = {}) =>
    (dispatch) => {
      return axiosInstance({
        method: "POST",
        data: { ...data },
        headers: {
          Authorization: localStorage.getItem("authData")
            ? "Bearer " + localStorage.getItem("authData")
            : null,
        },
      })
        .then((res) => {
          // dispatch(setCompanyProfileFav(res.data));
        })
        .catch((err) => {
          console.log("Company Updates response - error -> ", err);
          return { status: "failed" };
        });
    };

// const setCompanyProfileFav = (data) => ({
//   type: actionTypes.COMPANY_PROFILE_FAVORITE,
//   data,
// });
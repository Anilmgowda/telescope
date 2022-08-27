import * as actionTypes from "../actionTypes";

export const getDashBoardDetails = () => {
  return {
    type: actionTypes.GET_DASHBOARD_DETAILS,
  };
};

export const getPipeLine = (axiosInstance, data) => (dispatch) => {
  return axiosInstance({
    method: "GET",
    // data: {},
    params: {
      ...data,
    },
    headers: {
      Authorization: localStorage.getItem("authData")
        ? "Bearer " + localStorage.getItem("authData")
        : null,
    },
  })
    .then((res) => {
      dispatch({ type: actionTypes.SET_TP_PIPELINE, data: res?.data });
      if (res.hasOwnProperty("error")) {
        return { status: "failed" };
      } else {
        return { status: "success" };
      }
    })
    .catch((err) => {
      console.warn("Response - error -> ", err?.response?.data?.message);
      return { status: "failed", message: err?.response?.data?.message };
    });
};

export const getCompanyUpdateTemplate = (axiosInstance, data) => (dispatch) => {
  dispatch({ type: actionTypes.COMPANY_UPDATE_LOADING, data: true });
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
      dispatch(setCompanyUpdateTemplate(res.data));
    })
    .then(() =>
      dispatch({ type: actionTypes.COMPANY_UPDATE_LOADING, data: false })
    )

    .catch((err) => {
      console.log("Company Updates response - error -> ", err);
      return { status: "failed" };
    });
};

export const getCompanyUpdateType = (axiosInstance, data) => (dispatch) => {
  return axiosInstance({
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("authData")
        ? "Bearer " + localStorage.getItem("authData")
        : null,
    },
  })
    .then((res) => {
      dispatch(setCompanyUpdateType(res.data));
    })
    .catch((err) => {
      console.log("Company Updates Type response - error -> ", err);
      return { status: "failed" };
    });
};

const setCompanyUpdateType = (data) => ({
  type: actionTypes.COMPANY_UPDATE_TYPE,
  data,
});

const setCompanyUpdateTemplate = (data) => ({
  type: actionTypes.COMPANY_UPDATE,
  data,
});

export const getCompanyUpdateForFilter =
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
        dispatch(setCompanyUpdateForFilter(res.data));
      })
      .catch((err) => {
        console.log("Company Updates response - error -> ", err);
        return { status: "failed" };
      });
  };

const setCompanyUpdateForFilter = (data) => ({
  type: actionTypes.COMPANY_FILTER_UPDATE,
  data,
});

export const getLoggedInUser = (axiosInstance, data) => (dispatch) => {
  return axiosInstance({
    method: "GET",
    params: { ...data },
    headers: {
      Authorization: localStorage.getItem("accessToken")
        ? "Bearer " + localStorage.getItem("accessToken")
        : null,
    },
  })
    .then((res) => {
      dispatch(setLoggedInUser(res.data));
    })
    .catch((err) => {
      console.log("Company Updates response - error -> ", err);
      return { status: "failed" };
    });
};

const setLoggedInUser = (data) => ({
  type: actionTypes.SET_LOGGED_IN_USER_INFO,
  data,
});

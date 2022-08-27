import * as actionTypes from "../actionTypes";

export const investorsearchReferences =
  (axiosInstance, data, scoper) => (dispatch) => {
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
        dispatch(setInvestorReferencesSearch(res.data));
        if (res.hasOwnProperty("error")) {
          return { status: "failed" };
        } else {
          return { status: "success" };
        }
      })
      .catch((err) => {
        console.warn("Response - error -> ", err);
        dispatch(setInvestorReferencesSearch({ error: true }));

        return { status: "failed" };
      });
  };

const setInvestorReferencesSearch = (data) => ({
  type: actionTypes.SET_INVESTOR_SEARCH,
  data,
});

export const searchReferences =
  (axiosInstance, data, scoper, appendMore, isSubmitClicked) => (dispatch) => {
    return axiosInstance({
      method: "GET",
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
        if (res.hasOwnProperty("error")) {
          return { status: "failed" };
        } else {
          let appendedVal = Object.assign(res.data, { isAppend: isSubmitClicked ? false : appendMore });
          if (scoper && Object.keys(scoper).length > 0) {
            const finalResult = Object.assign(appendedVal, { scopers: scoper });
            dispatch(setReferencesSearch(finalResult));
          } else {
            dispatch(setReferencesSearch(appendedVal));
          }
          return { status: "success", resLength: res?.data?.results?.length };
        }
      })
      .catch((err) => {
        console.warn("Response - error -> ", err?.response?.data?.errors);
        return { status: "failed" };
      });
  };

const setReferencesSearch = (data) => ({
  type: actionTypes.SET_REFERENCES_SEARCH,
  data,
});

export const getemailhistory = (axiosInstance, data, scoper) => (dispatch) => {
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
      dispatch(setemailhistory(res.data));
    })
    .catch((err) => {
      dispatch(setEmailError(err));
      console.warn("Response - error -> ", err);
      return { status: "failed" };
    });
};
const setemailhistory = (data) => ({
  type: actionTypes.GET_EMAIL_HISTORY,
  data,
});

const setEmailError = ({ response }) => ({
  type: actionTypes.SET_EMAIL_ERROR,
  data: response.data.message,
});

export const gettpowner = (axiosInstance, data, scoper) => (dispatch) => {
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
      dispatch(settpowner(res.data));
    })
    .catch((err) => {
      console.warn("Response - error -> ", err);
      return { status: "failed" };
    });
};
const settpowner = (data) => ({
  type: actionTypes.GET_TP_OWNER,
});


export const getProjects = (axiosInstance) => (dispatch) => {
  axiosInstance({
    method: "GET",
    data: {},
    params: {},
    headers: {
      Authorization: localStorage.getItem("authData")
        ? "Bearer " + localStorage.getItem("authData")
        : null,
    },
  })
    .then((res) => {
      dispatch(setProjects(res?.data?.results));
    })
    .catch((err) => {
      console.warn("Response - error -> ", err);
    });
};

const setProjects = (data) => ({
  type: actionTypes.SET_PROJECTS,
  data,
});

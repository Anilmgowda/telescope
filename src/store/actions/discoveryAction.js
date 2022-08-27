import axios from 'axios';
import * as actionTypes from "../actionTypes";
import { getAddress } from "../../utils/getServerAddress";

export const getSourceMetrics = (axiosInstance, type) => (dispatch) => {
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
      dispatch(setSourceMetrics(res?.data?.results, type));
    })
    .catch((err) => {
      console.warn("Response - error -> ", err);
    });
};

const setSourceMetrics = (data, type) => ({
  type: type === "linkedin" ? actionTypes.SET_LINKEDIN_METRICS : type === "spyfu" ? actionTypes.SET_SPYFU_METRICS : type === "alexa" ? actionTypes.SET_ALEXA_METRICS : null,
  data,
});



export const submitFilterMetrics = (selectedFilters) => (dispatch) => {
  let filters = [];
  for (let key in selectedFilters) {
    let url = getAddress() + `${key === "linkedin" ? "/linkedin-filter" : key === "spyfu" ? "/spyfu-filter" : key === "alexa" ? "/alexa-filter" : null}`;
    var payload = selectedFilters[key].reduce(function (acc, val) {
      return Object.assign(acc, val);
    }, {});
    let finalObj = {
      url: url,
      payload: payload
    }
    filters.push(finalObj)
  }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem("authData")
      ? "Bearer " + localStorage.getItem("authData")
      : null,
  }
  return axios.all(filters.map((item) => axios.get(item.url, { params: { ...item.payload }, headers: headers })))
    .then(axios.spread((data1, data2, data3) => {
      let newarr = [];
      if (data1?.data) {
        newarr.push(data1?.data)
      }
      if (data2?.data) {
        newarr.push(data2?.data)
      }
      if (data3?.data) {
        newarr.push(data3?.data)
      }
      let newObj = {}
      filters.forEach((item, index) => {
        let key = item?.url?.split("/").pop();
        let urlKey = key?.includes("linkedin-filter") ? "linkedin" : key?.includes("spyfu-filter") ? "spyfu" : key?.includes("alexa-filter") ? "alexa" : ""
        if (urlKey) {
          newObj[urlKey] = newarr[index]
        }
      })

      dispatch(setFilterMetrics({ data: newObj, selectedMatrices: Object.keys(payload) }))
      return { status: "success" }
    }))
    .catch((err) => {
      console.warn("Response - error -> ", err);
      return { status: "failed", errorMessage: err?.response?.data?.Message || "Something went wrong!" }
    });
};

const setFilterMetrics = (data, type) => ({
  type: actionTypes.SET_FILTER_METRICS,
  data,
});
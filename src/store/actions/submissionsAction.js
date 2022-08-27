import axios from "axios";
import * as actionTypes from "../actionTypes";
import moment from "moment";
import {removeUnderScoreAndCapitalize} from "../../utils/removeUnderScoreAndCapitalize";

export const getFileMatricsTemplate = (axiosInstance) => (dispatch) => {
	return axiosInstance({
		method: "GET",
		data: {},
		params: {},
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			dispatch(setFileMaticsTemplate(res.data));
			if(res.hasOwnProperty('error')) {
				return {status : "failed"}
			} else {
				return {status : "success"}
			}
		})
		.catch((err) => {
			console.log("File matrics template response - error -> ", err);
			return {status : "failed"}
		});
};

const setFileMaticsTemplate = (data) => ({
	type: actionTypes.SET_FILE_MATRICS_TEMPLATE,
	data,
});


export const getSearchResult = (query, url) => (dispatch) => {
	return axios.get(`${url}?search_term=${query}`, {
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			return {status: "success", data: res?.data}
		})
		.catch((err) => {
			return {status: "failed", data: {}}
		});
};

export const getSearchResultWithoutTerm = (url) => (dispatch) => {
	return axios.get(`${url}`, {
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			return {status: "success", data: res?.data}
		})
		.catch((err) => {
			return {status: "failed", data: {}}
		});
};

export const submitMatrics = (url,payload ) => (dispatch) => {
	return axios.post(`${url}`,{
		...payload
	}, {
		
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			if (res.hasOwnProperty('error')) {
				return { status: "failed" }
			} else {
				return { status: "success" }
			}
		})
		.catch((err) => {
			console.log("File matrics template response - error -> ", err);
			return { status: "failed" }
		});
};

export const getAllTemplates = (axiosInstance) => (dispatch) => {
	return axiosInstance({
		method: "GET",
		data: {},
		params: {},
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			dispatch(setAllTemplates(res?.data?.data));
			if(res.hasOwnProperty('error')) {
				return {status : "failed"}
			} else {
				return {status : "success"}
			}
		})
		.catch((err) => {
			console.log("File matrics template response - error -> ", err);
			return {status : "failed", errorMessage: err?.response?.data?.errors}
		});
};

const setAllTemplates = (data) => ({
	type: actionTypes.SET_TEMPLATES,
	data,
});


export const getHtml = (url) => (dispatch) => {
	return axios.get(`${url}`, {
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			return {status: "success", data: res?.data}
		})
		.catch((err) => {
			return {status: "failed", data: {}}
		});
};

export const saveGraphOptions = (data) => ({
	type: actionTypes.SET_GRAPH_OPTION,
	data,
});

export const submitGraph = (selectedFilters, scopers) => (dispatch) => { 
    return axios.get(`${selectedFilters[0]?.url}`, {
		params: {...selectedFilters[0]?.payload},
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
    .then(response => {

		let groups = {};
       
			let objName = scopers
		
			if(!groups[objName]) {
				groups[objName] = {
					xAxis: {
						categories: []
					},
					series: [],
				}
			}
			if(groups[objName]) {
				let newDate = "", output = [];
				response?.data?.results?.forEach((item) => {
					newDate = `${moment(item?.from_date).format("L")}-${moment(item?.to_date).format("L")}`;
					groups[objName][`xAxis`][`categories`].push(newDate)
					for (let itemKeys in item) {
						let keyName = removeUnderScoreAndCapitalize(itemKeys)
						let unique = output?.find(o => o.name === keyName);
						if(!unique && keyName !== "Scoper" && keyName !== "From Date" && keyName !== "To Date" && keyName !== "Uuid") {
							let newO = {
								name : keyName,
								data : [item[itemKeys || null]]
							}
							output.push(newO)
						}else if(unique && Object.keys(unique).length){
							var existingIndex = output.findIndex(i => i.name === keyName);
							output[existingIndex]?.data?.push(item[itemKeys])
						}
					  }
				})
				groups[objName][`series`]= JSON.parse(JSON.stringify(output))
			}
       dispatch(saveGraphOptions(groups))
      return {status : "success"}
    })
    .catch((err) => {
      console.warn("Response - error -> ", err);
      return {status : "failed", errorMessage: err?.response?.data?.Message || "Something went wrong!"}
    });
  };

  export const getTable = (url, params) => (dispatch) => {
	return axios.get(`${url}`, {
		params: {
			...params
		},
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},
	})
		.then((res) => {
			dispatch({type: actionTypes.SET_TABLE, data:res?.data?.results})
			return {status: "success",}
		})
		.catch((err) => {
			return {status : "failed", errorMessage: err?.response?.data?.Message || "Something went wrong!"}
		});
};
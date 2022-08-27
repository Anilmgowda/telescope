import * as actionTypes from "../actionTypes";


export const getScopers = (axiosInstance) => (dispatch) => {
	axiosInstance({
		method: "GET",
		data: {},
		params: {},
		headers: {
			"Authorization": localStorage.getItem('authData') ? "Bearer " + localStorage.getItem('authData') : null
		},

	})
		.then((res) => {
			dispatch(setScopers(res));
		})
		.catch((err) => {
			console.log("Response - error -> ", err);
		});
};

const setScopers = (data) => ({
	type: actionTypes.SET_SCOPERS,
	data,
});

export const getCompanySearchResult = (axiosInstance, query) => (dispatch) => {
	return axiosInstance({
		method: "GET",
		data: {},
		params: {...query},
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


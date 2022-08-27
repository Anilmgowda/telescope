import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

import * as instances from "../../config/appConfig/axiosInstance";
import {initializeLogout } from "../../store/actions";


class AjaxSetup extends Component {
  constructor(props) {
    super(props);
    //auth actions
    this.axiosInstances = instances;
    this.axiosInterceptors = {};
    for (let key in this.axiosInstances) {
      this.axiosInstances[key].interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          if (axios.isCancel(error)) {
            console.log("request cancelled");
          } else if (error?.response?.status === 401) {

            console.log('Request canceled', error?.message);
            this.props.initializeLogout()
            
          } else {
            return Promise.reject(error);
          }
        }
      );
      this.axiosInterceptors = {
        ...this.axiosInterceptors,
      };
    }
  }

  componentWillUnmount() {
    for (let key in this.axiosInstances) {
      this.axiosInstances[key].interceptors.request.eject(
        this.axiosInterceptors[key]
      );
    }
  }

  render() {
    const { children } = this.props;
    return <>{children}</>;
  }
}



export default connect(() => ({}), {initializeLogout})(AjaxSetup) ;

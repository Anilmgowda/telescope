import { useEffect, useRef } from "react";

import Axios from "axios";

/** hooks version of cancelRequests hoc */

function useCancelRequests(...axiosInstances) {
  const axiosInterceptors = useRef([]);
  const instances = useRef(axiosInstances);

  useEffect(() => {
    const cancelToken = Axios.CancelToken.source();
    const apiInstances = instances.current;

    axiosInterceptors.current = apiInstances.map((instance) =>
      instance.interceptors.request.use(
        (config) => {
          //modifying the config object of requests sent from each axios
          //instance and adding cancel token to the request
          config.cancelToken = cancelToken.token;
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      )
    );

    return () => {
      //cancel all the requests when component unmounts
      cancelToken.cancel();

      //remove intereceptors added to the axios instances
      apiInstances.map((instance, index) =>
        instance.interceptors.request.eject(axiosInterceptors.current[index])
      );
    };
  }, []);

  return null;
}

export { useCancelRequests };

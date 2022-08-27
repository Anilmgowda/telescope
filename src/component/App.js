import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { history } from "../config";
import OfflineView from "./OfflineView/OfflineView";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";
import { checkAuth } from "../store/actions";
import MainRoutes from "./MainRoutes/MainRoutes";
import AjaxSetup from "./AjaxSetup/AjaxSetup"

function App() {
  const dispatch = useDispatch();
  const [token] = useSelector(({ authReducer }) => [authReducer.token])

  useEffect(() => {
    const currenntPath = history.location.pathname;
    dispatch(checkAuth(currenntPath))
  }, [token])

  return (
    <>
      <OfflineView>
        <ErrorBoundary>
          <AjaxSetup>
            <Router history={history}>
              <MainRoutes />
            </Router>
          </AjaxSetup>
        </ErrorBoundary>
      </OfflineView>
    </>
  )
}

export default App
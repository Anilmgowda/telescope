
import React from 'react';
import {Navigate, Outlet} from 'react-router-dom'

function PublicRoutes() {
const loggedInUser = localStorage.getItem("authData");
  return  loggedInUser?<Navigate to="/dashboard"/>: <Outlet/>
}

export default PublicRoutes;
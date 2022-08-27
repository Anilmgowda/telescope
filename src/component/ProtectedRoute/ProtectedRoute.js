
import React,{useEffect} from 'react';
import {useLocation} from "react-router"

import {Navigate, Outlet} from 'react-router-dom'

function ProtectedRoute() {
const location = useLocation()

const loggedInUser = localStorage.getItem("authData");
  return loggedInUser?<Outlet/>: <Navigate to="/login" replace state={{from:location}}/>
}

export default ProtectedRoute;
import React from "react";
import Discovery from "../../component/Discovery/Discovery";
import Submissions from "../../component/Submissions/Submissions";
import Dashboard from "../../component/Dashboard/Dashboard";
import References from "../../component/References/References";
import CompanyProfile from "../../component/CompanyProfile/CompanyProfile";
import Login from "../../component/Login/Login";

const routesConfig = [
  {
    path: "/discovery",
    component: <Discovery redirectTo="/discovery" />,
    exact: true,
  },
  {
    path: "/submissions",
    component: <Submissions redirectTo="/submissions" />,
    exact: true,
  },
  {
    path: "/dashboard",
    component: <Dashboard redirectTo="/dashboard" />,
    exact: true,
  },
  {
    path: "/references",
    component: <References redirectTo="/references" />,
    exact: true,
  },
  {
    path: "/companyProfile",
    component: <CompanyProfile redirectTo="/companyProfile" />,
    exact: true,
  },
  {
    path: "/login",
    component: <Login redirectTo="/login" />,
    exact: true,
  },
];

export { routesConfig };

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from "../Dashboard/Dashboard";
import References from "../References/References";
import ParentContainer  from '../ParentContainer/ParentContainer';
import Login from "../Login/Login"
import Submissions from "../Submissions/Submissions";
import Discovery from "../Discovery/Discovery";
import CompanyProfile from "../CompanyProfile/CompanyProfile";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import PublicRoutes from "../PublicRoutes/PublicRoutes";

const MainRoutes = () => (
    <Routes>
        {/** Protected Routes */}
        {/** Wrap all authenticated Route under ProtectedRoutes element */}
        <Route path="/" element={<ProtectedRoute />}>
            <Route path="/" element={<ParentContainer />}>
                <Route path="/" element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="conversations" element={<References />} />
                <Route path="discovery" element={<Discovery />} />
                <Route path="submissions" element={<Submissions />} />
                <Route path="companyProfile" element={<CompanyProfile />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
        </Route> 
        {/** Public Routes */}
        {/** Wrap all public Route under PublicRoutes element */}
        <Route path="login" element={<PublicRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
        </Route>
    </Routes>
)

export default MainRoutes
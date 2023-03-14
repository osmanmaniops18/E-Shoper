import React from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({  component: Component, ...rest }) {
    const { isAuthenticated } = useSelector((state) => state.user);
    let navigate = useNavigate();
 

   return isAuthenticated ?  <Component/> : navigate("/login");

    
};

export default ProtectedRoute;
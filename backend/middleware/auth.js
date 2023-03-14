const ErrorHandler = require("../utils/errorHandler");
const CatchasyncError = require("./CatchasyncError");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");


exports.isAuthenticatedUser=CatchasyncError(async(req,resp,next)=>{
    const {token}=req.cookies;
    

    if(!token){
        return next(new ErrorHandler("Please Login to access this resource",401));
    }

    const decodeData=jwt.verify(token, process.env.JWT_SECRET);

   req.user= await User.findById(decodeData.id);

   next();
});

exports.authorizeRole=(...roles)=>{
    return(req,resp,next)=>{
        if(!roles.includes(req.user.role)){
         return next(   new ErrorHandler(`Role: ${req.user.role} is not allowed to access the Resources`,403));
        }

        next();
    };
};
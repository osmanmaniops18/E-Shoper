const ErrorHandler=require ("../utils/errorHandler.js");

module.exports=(err,req,resp,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message= err.message || "Internal Server Error";

    //Wrong MOngodb Id Error

    if(err.name==="CastError"){
        const message=`Resources Not Found, Invalid: ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    //Mongose Duplicate Key Error

    if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
        err=new ErrorHandler(message,400);
    }
     
      //Json WEb token Error

      if(err.name==="JsonWebTokenError"){
        const message=`Json Web Token is invalid,try again`;
        err=new ErrorHandler(message,400);
    }
     //Wrong MOngodb Id Error

     if(err.name==="TokenExpiredError"){
        const message=`Json Web Token is Expired,try again`;
        err=new ErrorHandler(message,400);
    }
    resp.status(err.statusCode).json({
        success:false,
        message:err.message
    });
}
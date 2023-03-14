const ErrorHandler=require("../utils/errorHandler");
const catchasyncError=require("../middleware/CatchasyncError");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const { json } = require("body-parser");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const bycrypt=require("bcryptjs");
const cloudinary = require("cloudinary");

//Register a User

exports.registerUser=catchasyncError( async(req,resp,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });

    const {name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
       avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    });

    sendToken(user,201,resp);
});

//Login User

exports.loginUser=catchasyncError(async(req,resp,next)=>{
    const {email,password}=req.body;
    

    //Checking if user has given password and email both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password",400));
    }
 
    
    const user= await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email and Password",401));
    }


    const isPasswordMatched= await bycrypt.compare(password,user.password);
   


    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email and Password",401));
        
    }



   sendToken(user,200,resp);



});


//Logout User

exports.logout=catchasyncError(async(req,resp,next)=>{
         
    resp.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    resp.status(200).json({
    success:true,
    message:"Logged OUT",
    });
});


//Forgot Password

exports.forgotPassword=catchasyncError(async(req,resp,next)=>{
     
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User Not Found",404));
    }

    //Get ResetPassword Token

    const resetToken=user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave:false });

    const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message=`Your password reset token is temp :-\n\n ${resetPasswordUrl} \n\nIf you have not requested this email then please ignore it`;

    try {

        await sendEmail({
          
            email:user.email,
            subject:"E-Shopper Password Recovery",
            message,
        });

        resp.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({ validateBeforeSave:false });
        return next(new ErrorHandler(error.message,500));
    }
});

//Reset Password

exports.resetPassword=catchasyncError(async(req,resp,next)=>{

    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()},
    });
    if(!user){
        return next(new ErrorHandler("Reset Password Token Is Invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not Matched",400));
    }
       user.password=req.body.password;
       user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;

        await user.save();

        sendToken(user,200,resp);
});


//Get user details

exports.getUserDetails=catchasyncError(async(req,resp,next)=>{

    const user=await User.findById(req.user.id);

    resp.status(200).json({
        success:true,
        user
    });
});

//Update User Password

exports.updatePassword=catchasyncError(async(req,resp,next)=>{

    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched= user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incoorect",400));
        
    }
    if(req.body.newPassword !==req.body.confirmPassword){
        return next(new ErrorHandler("Password Does Not matched",400));
    }

    user.password=req.body.newPassword;
    await user.save();

   sendToken(user,200,resp);
});

//Update Profile

exports.updateProfile=catchasyncError(async(req,resp,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
    
        const imageId = user.avatar.public_id;
    
        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        newUserData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    resp.status(200).json({
        success:true,
    });
});

//Get All users (Admin)

exports.getAllUsers=catchasyncError(async(req,resp,next)=>{


    const users=await User.find();

    resp.status(200).json({
        success:true,
        users
    });
});

//Get Single user details (Admin)

exports.getSingleUserDetails=catchasyncError(async(req,resp,next)=>{


    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Does not exixt with Id: ${req.params.id}`));
    }

    resp.status(200).json({
        success:true,
        user,
    });
});

//Update Any User Role By Admin

exports.updateProfilebyAdmin=catchasyncError(async(req,resp,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };


    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
   

    resp.status(200).json({
        success:true,
    });
});


//Delete User by Admin

exports.deleteUser=catchasyncError(async(req,resp,next)=>{
  

    const user= await User.findById(req.params.id);

 

    if(!user){
        return next(new ErrorHandler(`User Does not exixt With id :${req.params.id}`,400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  
    resp.status(200).json({
        success:true,
        message:'User Delted Successfully',
    });
});
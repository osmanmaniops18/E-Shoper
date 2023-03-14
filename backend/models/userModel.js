const mongoose=require("mongoose");
const validator=require("validator");
const bycrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const crypto=require("crypto");


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter your name"],
        maxLength:[30,"Name Cannot be exceed more then 30 character"],
        minLength:[4,"Name should have  more then 4 character"]
    },
    email:{
        type:String,
        required:[true,"Please Enter your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter Valid Emial"],

    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minLength:[8,"Password should be greater then 8 character"],
        select:false,

    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            },
        },
    role:{
        type:String,
        default:"user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    this.password= await bycrypt.hash(this.password,10);
});

//JWT Tokeen
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
};

//Compare Password

userSchema.methods.comparePassword=async function(enteredPassword){
    return await bycrypt.compare(enteredPassword,this.password);
};

//Get Rest Password Token

userSchema.methods.getResetPasswordToken=function(){
   // Genereting Token

   const resetToken=crypto.randomBytes(20).toString("hex");

   //Hashing and adding resetPasswordToken to userScheme
   this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    

   this.resetPasswordExpire=Date.now() + 15 * 60 * 1000;

   return resetToken;
};
module.exports=mongoose.model("User",userSchema);
const app=require("./app");

const dotenv=require("dotenv");
const connectDatabase=require("./config/database");
const cloudinary=require("cloudinary");


//Handling Uncaught Error

process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shuting Down The Server Due to Uncaught Error");

    process.exit(1);

})

dotenv.config({path:"backend/config/confg.env"});

//connect database

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})



//Unhandled Promises Rejection Error

process.on("unhandledRejection",(err)=>{
  console.log(`Error: ${err.message}`);
  console.log("Shuting Down The Server Due to unhandled Promise Rejection");
  server.close(()=>{
    process.exit(1);
  });
});
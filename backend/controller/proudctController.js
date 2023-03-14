const { json } = require("express");
const Product=require("../models/productsModels");
const ErrorHandler=require("../utils/errorHandler");
const catchasyncError=require("../middleware/CatchasyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");


// Create Product --admin

exports.createProduct= catchasyncError(async(req,resp,next)=>{

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user=req.user.id;
    const product=await Product.create(req.body);
    resp.status(201).json({
        success:true,
        product
    });
}
);
//Get Products

exports.getAllProducts=catchasyncError(async (req,resp,next)=>{
    
    const resultperPage=8;
    const productCount=await Product.countDocuments();
    const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter();
    let products = await apiFeature.query;

    let filteredProductsCount = products.length;
  
    apiFeature.pagination(resultperPage);
  
    products = await apiFeature.query.clone();
    resp.status(200).json({ 
    success:true,
    products,
    productCount,
    resultperPage,
    filteredProductsCount,
});
}
);

//Updata Products --Admin

exports.updataProduct=catchasyncError( async (req,resp,next)=>{

    let product=await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
      // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
});

      resp.status(200),json({
        success:true,
        product
      });
});

// Get Products Details

exports.getProductDetails=catchasyncError( async (req,resp,next)=>{


    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    

    resp.status(200).json({
        success:true,
        product,
    
    });
});
// Get All Product (Admin)
exports.getAdminProducts = catchasyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });





//Delete Product

exports.deleteProduct= catchasyncError( async(req,resp,next)=>{
  

    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
      // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

    await product.remove();

    resp.status(200).json({
        success:true,
        message:"Product Deleted Succesfully"
    });
} );

//Create New Review or Update the review

exports.createProductReview= catchasyncError( async(req,resp,next)=>{

    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,

    };

    const product=await Product.findById(productId);

    const isReviewed=product.reviews.find((rev)=>rev.user.toString()===req.user._id.toString());
 
    if(isReviewed){
        
     
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString())
            (rev.rating=rating),(rev.comment=comment);
        
        }
        );
    }
    else{
        product.reviews.push(review);
        product.numOfReviews=product.reviews.length;
        
    }

    let avg=0;
    product.ratings=product.reviews.forEach(rev=>{
        
        avg+=rev.rating;
    })

    product.ratings=avg
    /product.reviews.length;

    await product.save({validateBeforeSave:false});

    resp.status(200).json({
        success:true,
       
    });
});

//Get All reviews of a single product

exports.getAllReviews=catchasyncError(async(req,resp,next)=>{
    const product=await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }

    resp.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

//Delete Reviews

exports.deleteReviews=catchasyncError(async(req,resp,next)=>{
    const product=await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product Not Found",404));
    }
    const reviews=product.reviews.filter(
        (rev)=>rev.id.toString() !== req.query.id.toString()
    );
    let avg=0;
    reviews.forEach(rev=>{
        
        avg+=rev.rating;
    })
    let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  

    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });


    resp.status(200).json({
        success:true,
       
    });
});
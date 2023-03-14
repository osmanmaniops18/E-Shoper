const Order=require("../models/orderModel");
const Product=require("../models/productsModels");
const ErrorHandler=require("../utils/errorHandler");
const catchasyncError=require("../middleware/CatchasyncError");


//Create New Order

exports.newOrder=catchasyncError(async(req,resp,next)=>{

    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    }=req.body;

    const order= await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    resp.status(200).json({
        success:true,
        order,
    });
});

//Get Single Order

exports.getSingleOrder=catchasyncError(async(req,resp,next)=>{
    const order=await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order Does Not Found With this id:",404));

    }

    resp.status(200).json({
        success:true,
        order,
    });
});


//Get Logged in User Orders

exports.myOrders=catchasyncError(async(req,resp,next)=>{
    const orders=await Order.find({user:req.user._id});

 

    resp.status(200).json({
        success:true,
        orders,
    });
});


//Get all Orders --Admin

exports.getAllOrders=catchasyncError(async(req,resp,next)=>{
    const orders=await Order.find();

    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })
 

    resp.status(200).json({
        success:true,
        orders,
        totalAmount,
    });
});


//Update Order Status --Admin

exports.updateOrderStatus=catchasyncError(async(req,resp,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order Does Not Found with this id:",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delievered the order",400));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }
   
    order.orderStatus=req.body.status;

    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:false});
 

    resp.status(200).json({
        success:true,
      
    });
});

async function updateStock(id,quantity){
     const product=await Product.findById(id);
     product.stock-=quantity;
     await product.save({validateBeforeSave:false});
}


//Delete Order --Admin

exports.DeleteOrder=catchasyncError(async(req,resp,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Does Not Found with this id:",404));
    }

   await order.remove();

    resp.status(200).json({
        success:true,
       
    });
});
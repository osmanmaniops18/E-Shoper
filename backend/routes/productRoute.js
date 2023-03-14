const express=require("express");
const { getAllProducts,createProduct,updataProduct,deleteProduct,getProductDetails, createProductReview, getAllReviews, deleteReviews, getAdminProducts} = require("../controller/proudctController");
const { isAuthenticatedUser,authorizeRole } = require("../middleware/auth");


const router=express.Router();

router.route("/products").get( getAllProducts);
router.route("/admin/products/new").post(isAuthenticatedUser,authorizeRole("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, authorizeRole("admin"),updataProduct).delete(isAuthenticatedUser, authorizeRole("admin"),deleteProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getAllReviews).delete(isAuthenticatedUser,deleteReviews);
router.route("/admin/products").get(isAuthenticatedUser,authorizeRole("admin"),getAdminProducts)

module.exports=router; 
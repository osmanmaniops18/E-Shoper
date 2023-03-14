import React from 'react';
import {Link} from "react-router-dom";
import { Rating } from "@material-ui/lab";
import "./home.css";



function ProductCard({product}) {
  const options = {
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };
  return (
   <>
  <Link className='productCard' to={`/product/${product._id}`}>
   <img src={product.images[0].url} alt="Product Imae"/>
   <p>{product.category}</p>
   <div>
    <Rating {...options}/><span className='cardspan'>({product.numOfReviews} Reviews)</span>
   </div>
   <span>${product.price}</span>
  </Link>
   </>
  );
}

export default ProductCard;
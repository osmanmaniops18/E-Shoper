import React, { useEffect } from 'react';
import MouseIcon from '@mui/icons-material/Mouse';
import "./home.css";
import ProductCard from './ProductCard';
import MetaData from '../MetaData';
import { clearError, getProduct } from '../../../actions/productAction';
import {useSelector,useDispatch} from "react-redux";
import Loader from '../Loader/Loader';
import { useAlert } from 'react-alert';


function Home() {
    const alert = useAlert()
    const dispatch=useDispatch();
    const {loading,error,products,}=useSelector((state)=>state.products);

    useEffect(()=>{
    dispatch(getProduct());
    if(error){
        alert.error(error);
        dispatch(clearError());
    }
    },[dispatch,error,alert]);
  return (
   <>
    {loading ? (<Loader/>):( <>
       <MetaData title="E-Shooper" />
        <div className='banner'>
            <p>Welcome To Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href='#container' >
                <button>Scroll <MouseIcon/> </button>
            </a>
        </div>
        <h2 className='homeHeading'>Featured Products</h2>
  
        <div className='container' id='container'>
           {products && products.map((product)=>
           <ProductCard key={product._id} product={product}/>
           )}
        </div>
    </>)}
   </>
  )
}

export default Home;
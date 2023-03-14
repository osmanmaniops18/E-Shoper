import React, { useState } from 'react';
import "./search.css"
import {useNavigate} from 'react-router-dom';
import MetaData from "../layout/MetaData";


function Search() {
    const [keyword,setKeyword]=useState("");
    const navigate = useNavigate();
   

    const searchSubmitHandler=(e)=>{
e.preventDefault();
if(keyword.trim()){
    navigate(`/products/${keyword}`);
}else{
    navigate("/products")
}
    };
  return (
    <>
        <MetaData title="Search a Product --E-Shopper" />
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input type="text" placeholder='Search a Prouduct..' onChange={(e)=>setKeyword(e.target.value)}/>
            <input type="submit" value="Search"/>
        </form>
    </>
  )
}

export default Search;
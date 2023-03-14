import React from 'react';
import playstore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./footer.css";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { pink } from '@mui/material/colors';

function Footer() {
  return (
    <>
    <footer id='footer'>
    
    <div className='leftFooter'>
        <h4>Download Our App</h4>
        <p>Download App For Android And IOs Mobile Phone</p>
        <img src={playstore} alt='playstoreIcon'/>
        <img src={appStore} alt='appstoreIcon'/>
    </div>
    <div className='midFooter'>
        <h1>E-Shooper</h1>
        <p>High Quality is our First Priority</p>
        <p>Copyrights 2022 &copy; M.Usman.Haider </p>
    </div>
    <div className='rightFooter'>
         
        <a href='instagram.com' ><InstagramIcon sx={{ color: pink[500] }} fontSize="large"/></a>
        <a href='Facebook.com' ><FacebookIcon  color="secondary" fontSize="large"/></a>
        <a href='twitter.com' ><TwitterIcon color="primary" fontSize="large"/></a>
    </div>
    </footer>

    </>
  )
}

export default Footer;
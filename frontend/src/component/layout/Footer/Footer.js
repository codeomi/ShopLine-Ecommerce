import "./Footer.css";
import { Facebook, Instagram } from '@mui/icons-material';
import React from 'react'
const Footer = () => {
  return (
    <footer id="footer">
      <div className='leftFooter'>
        <h4>Download our App</h4>
        <p>Download App for Android and IOS mobile phones</p>
        <img alt="playstore" src="https://raw.githubusercontent.com/meabhisingh/mernProjectEcommerce/master/frontend/src/images/playstore.png" />
        <img alt="IOS" src="https://raw.githubusercontent.com/meabhisingh/mernProjectEcommerce/master/frontend/src/images/Appstore.png" />

      </div>
      <div className='midFooter'>
        <h1>ShopLine</h1>
        <p>High Quality is our first priority</p>
        <p>Copyrights 2023</p>
      </div>

      <div className='rightFooter'>
        <h4>Follow Us</h4>
        <div>
        <Facebook className="icons" />
        <Instagram className="icons" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
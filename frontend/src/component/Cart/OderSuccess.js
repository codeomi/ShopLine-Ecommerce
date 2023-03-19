import React from 'react'
import "./OrderSuccess.css"
import {CheckCircle} from "@mui/icons-material"
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
 
const OderSuccess = () => {
  return (
    <div className='orderSuccess'>
        <CheckCircle/>
        <Typography>Your Order has been Placed</Typography>
        <Link to="/order/me">View Orders</Link>
    </div>   
    )
}

export default OderSuccess
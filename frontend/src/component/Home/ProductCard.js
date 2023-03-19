import React from 'react'
import { Link } from "react-router-dom"
import StarRatingComponent from 'react-star-rating-component';




const Product = ({ product }) => {
    const options = {
        name: "tshirt",
        edit: false,
        emptyStarColor: "gray",
        starColor: "red" ,
        value: product.ratings,
        size: window.innerWidth < 600 ? 20 : 25

    }
    return (
        <Link className='productCard' to={`/product/getproduct/${product._id}`}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <StarRatingComponent  {...options} /><span>({product.noOfReviews} Reviews)</span>
            </div>
            <span>{`₹${product.price}`}</span>


        </Link>
    )
}

export default Product
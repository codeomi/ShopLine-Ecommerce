import React from 'react'
import profilepng from "../../images/Profile.png"
import StarRatingComponent from 'react-star-rating-component';

const ReviewCard = ({review}) => {
    const options = {
        name: "tshirt",
        edit: false,
        emptyStarColor: "gray",
        starColor: "red" ,
        value: review.rating,
        size: window.innerWidth < 600 ? 20 : 25

    }
  return (
    <div className='reviewCard'>
        <img src={profilepng} alt="User" />
        <p>{review.name}</p>
        <StarRatingComponent  {...options} />
        <span>{review.comment}</span>
    </div>        
  )
}

export default ReviewCard
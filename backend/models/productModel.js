const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter product description."],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price."],
    maxLength: [8, "Price cannot be higher than 8 figures"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product Category."],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock."],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  noOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Product", productSchema)

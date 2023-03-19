const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrorHandler = require("../middleware/catchAsyncError");
const apiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//create product
exports.createProduct = catchAsyncErrorHandler(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

//get all products
exports.getAllProdcts = catchAsyncErrorHandler(async (req, res, next) => {
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apiFeature = new apiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.querry; //this contains all the filtered products
  let filteredProductsCount = products.length;
  apiFeature.pagination(resultPerPage);

  products = await apiFeature.querry.clone();
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

//get all products ---- ADMIN
exports.getAdminProdcts = catchAsyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

//update product  ---only admin
exports.updateProduct = catchAsyncErrorHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  if (images !== undefined) {
    for (let p = 0; p < product.images.length; p++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[p].public_id
      );
    }
  }

  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({ success: true, product });
});

//delete product

exports.deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  //deleting product images from cloud
  for (let p = 0; p < product.images.length; p++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[p].public_id
    );
  }
  await product.remove();
  res.status(200).json({ success: true, message: "Product Deleted" });
};

//get product details

exports.getProductDetails = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(200).json({ success: true, product });
};

//Create or update review
exports.createProductReview = catchAsyncErrorHandler(async (req, res, next) => {
  const { rating, comment } = req.body;
  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(req.body.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  //this will search reviews of the specific product to find the user has reviewwed earlier or not
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        review.rating = rating;
        review.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }
  //this is the overall rating of the product
  //and above was review rating per user
  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.noOfReviews;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, product: product.reviews });
});

//get all reviews of a product
exports.getReviews = catchAsyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product does not exist", 400));
  }
  res.status(200).json({ success: true, reviews: product.reviews });
});

//delete a review
exports.deleteReview = catchAsyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product does not exist", 400));
  }

  //giving the id of review in query and not user id
  const reviews = product.reviews.filter((rev) => {
    rev._id.toString() !== req.query.id.toString();
  });

  const avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / product.reviews.length;
  }
  const noOfReviews = reviews.length;

  //find the product of changed review and update those reviews
  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, noOfReviews },
    { new: true, runValidators: true, useFindAndModify: false }
  );
  res
    .status(200)
    .json({ success: true, message: "Product Deleted successfully" });
});

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProduct, clearError } from "../../actions/productActions";
import ProductCard from "../Home/ProductCard";
import Loader from "../layout/Loader/Loader";
import "./Product.css";
import { Pagination, Slider, Typography } from "@mui/material";
import { useAlert } from "react-alert";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "car",
  "Smartphone",
];

const Products = () => {
  const alert = useAlert();
  const keyword = useParams();
  const dispatch = useDispatch();
  const {
    products,
    loading,
    resultPerPage,
    productsCount,
    filteredProductsCount,
    error,
  } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const setCurrentPageNo = (e, value) => {
    setCurrentPage(value);
    console.log(currentPage);
  };

  const priceHandler = (e, newPrice) => {
    e.preventDefault();
    setPrice(newPrice);
  };

  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearError());
    }
    dispatch(getProduct(keyword, currentPage, price, category));
    document.title = "Products - ShopLine";
  }, [dispatch, keyword, currentPage, price, category, alert, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <h2 className="productHeading">Products</h2>
          <div className="products" id="container">
            {products &&
              products.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
          </div>
          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-sliderS"
              min={0}
              max={25000}
              size="small"
            ></Slider>
            <Typography>Category</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  onClick={() => setCategory(category.toLowerCase())}
                  key={category}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continous-slider"
                min={0}
                max={5}
                size="small"
              />
            </fieldset>
          </div>
          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                count={Math.ceil(productsCount / resultPerPage)}
                defaultPage={1}
                onChange={setCurrentPageNo}
                page={currentPage}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;

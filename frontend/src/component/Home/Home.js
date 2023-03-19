import React, { Fragment, useEffect } from 'react'
import "./Home.css"
import ProductCard from "./ProductCard.js"
import { clearError, getProduct } from "../../actions/productActions"
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData'



const Home = () => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const { loading, error, products } = useSelector(state => state.products)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearError())
        }
        dispatch(getProduct())
        document.title = "ShopLine - Home"
    }, [dispatch, error, alert])


    return (
        <Fragment>
            {loading ? <Loader /> : <Fragment>
               {/* <MetaData title="Home"/> */}
                <div className="banner">
                    <p>Welcome to ShopLine</p>
                    <h1>Find Amazing Products Bellow</h1>
                    <a href='#container'>
                        <button>Scroll</button></a>
                </div>
                <h2 className="homeHeading">Featured Products</h2>
                <div className="container" id="container">
                    {products && products.map((product) => <ProductCard product={product} key={product._id} />)}

                </div>
            </Fragment>}
        </Fragment>
    )
}

export default Home
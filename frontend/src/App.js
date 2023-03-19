import { React, useEffect, useState } from "react";
import Header from "./component/layout/Header/Header";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./component/Home/Home";
import Loader from "./component/layout/Loader/Loader";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userActions";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OderSuccess.js"
import MyOrders from "./component/Cart/MyOrders.js"
import OrderDetails from "./component/Cart/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from "./component/Admin/NewProduct.js"
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import Orders from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js"
import UsersList from "./component/Admin/UsersList.js"
import UpdateUser from "./component/Admin/UpdateUser.js"
import ProductReviews from "./component/Admin/ProductReviews.js"

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid-Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser()); //this will automatically load the user in the state once he is logged in
    getStripeApiKey();
  }, []);

  return (
    <div>
      <Router>
        <Header />
        {isAuthenticated && <UserOptions user={user} />}
        <Route exact path="/" element={<Home />}></Route>
        <Route
          path="/product/getproduct/:id"
          element={<ProductDetails />}
        ></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/products/:keyword" element={<Products />}></Route>
        <Route path="/login" element={<LoginSignUp />}></Route>
        <ProtectedRoute path="/account" element={<Profile />} />
        <ProtectedRoute path="/me/update" element={<UpdateProfile />} />
        <ProtectedRoute path="/pasword/update" element={<UpdatePassword />} />
        <Route path="/pasword/forgot" element={<ForgotPassword />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <ProtectedRoute path="/shipping" element={<Shipping />} />
        (stripeApiKey &&
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute path="/process/payment" element={<Payment />} />
        </Elements>
        )
        <ProtectedRoute path="/order/success" element={<OrderSuccess />} />
        <ProtectedRoute path="/orders" element={<MyOrders />} />

        <Routes>
        <ProtectedRoute path="/order/confirm" element={<ConfirmOrder />} />
        <ProtectedRoute path="/order/:id" element={<OrderDetails />} />
        </Routes>
        <ProtectedRoute isAdmin={true} path="/admin/dashboard" element={<Dashboard />} />
        <ProtectedRoute isAdmin={true} path="/admin/productlist" element={<ProductList />} />
        <ProtectedRoute isAdmin={true} path="/admin/product" element={<NewProduct />} />
        <ProtectedRoute isAdmin={true} path="/admin/product/:id" element={<UpdateProduct />} />
        <ProtectedRoute isAdmin={true} path="/admin/orders" element={<Orders />} />
        <ProtectedRoute isAdmin={true} path="/admin/order/:id" element={<ProcessOrder />} />
        <ProtectedRoute isAdmin={true} path="/admin/users" element={<UsersList />} />
        <ProtectedRoute isAdmin={true} path="/admin/user/:id" element={<UpdateUser />} />
        <ProtectedRoute isAdmin={true} path="/admin/reviews" element={<ProductReviews />} />
      </Router>
      <Footer />
    </div>
  );
}

export default App;

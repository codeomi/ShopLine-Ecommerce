import React, { Fragment, useState, useEffect, useRef } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import { useAlert } from "react-alert";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import "./Payment.css";
import { CreditCard, Event, VpnKey } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { createOrder, clearErrors } from "../../actions/orderAction";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const payBtn = useRef(null);

  const order = {
    shippingInfo,
    orderItems: orderInfo.cartItems,
    itemsPrice: orderInfo.subTotal,
    taxPrice: orderInfo.taxPrice,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          "Content-type": "application-json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );
      const client_secret = data.client_secret;

      if (!stripe || !elements) return;

      const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100), //stripe takes amount in the form of paise and not rupees
      };

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pincode,
              country: shippingInfo.country,
            },
          },
        },
      });

      if (result.error) {
        payBtn.current.disabled = false;
        alert.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          };
          dispatch(createOrder());
          navigate("/success");
        } else {
          alert.error("There is some isssue while processing the payment.");
        }
      }
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [alert, error, dispatch]);

  // ?*******
  return (
    <Fragment>
      <CheckoutSteps activeStep={2}></CheckoutSteps>
      <div className="paymentContainer">
        <form onSubmit={(e) => submitHandler(e)} className="paymentForm">
          <Typography>Card Info</Typography>
          <div>
            <CreditCard />
            <CardNumberElement className="paymentInput"></CardNumberElement>
          </div>
          <div>
            <Event />
            <CardExpiryElement className="paymentInput"></CardExpiryElement>
          </div>
          <div>
            <VpnKey />
            <CardCvcElement className="paymentInput"></CardCvcElement>
          </div>
          <input
            type="submit"
            value={`Pay - ${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;

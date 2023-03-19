import React, { Fragment, useState } from "react";
import "./Shipping.css";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import {
  Home,
  LocationCity,
  PinDrop,
  Phone,Public,TransferWithinAStation
} from "@mui/icons-material";
import { Country, State } from "country-state-city";
import CheckoutSteps from "../Cart/CheckoutSteps.js"
import {useNavigate} from "react-router-dom"

const Shipping = () => {
  const navigate= useNavigate()
  const dispatch = useDispatch();
  const alert = useAlert();
  const [shippingInfo] = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo.address);
  const [state, setState] = useState(shippingInfo.state);
  const [city, setCity] = useState(shippingInfo.city);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pincode, setPincode] = useState(shippingInfo.pincode);
  const [contact, setContact] = useState(shippingInfo.contact);

  const shippingSubmit=(e)=>{
    e.preventDefault()
    if(contact>10||contact<10){
      alert.error("Please enter correct Contact Number")
    }

    dispatch(saveShippingInfo({address,state,city,country,pincode,contact}))
    navigate("/order/confirm")

  }
  return (
    <Fragment>

      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <Home />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <LocationCity />
              <input
                type="text"
                placeholder="City"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <PinDrop />
              <input
                type="number"
                placeholder="Pin Code"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>

            <div>
              <Phone />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <Public />

              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStation />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { SpeedDial, SpeedDialAction, Backdrop } from "@mui/material";
import { Dashboard, Person, ExitToApp, ListAlt } from "@mui/icons-material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../actions/userActions";
import "./Header.css";

const UserOptions = ({ user }) => {
  const [cartItems] = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboard = () => {
    navigate("/admin/dashboard");
  };

  const orders = () => {
    navigate("/orders");
  };

  const logoutUser = () => {
    dispatch(logout());
    alert.success("Logged Successfully");
  };
  const account = () => {
    navigate("/account");
  };
  const cart = () => {
    navigate("/cart");
  };

  const options = [
    {
      icon: <ListAlt />,
      name: "Orders",
      func: orders,
    },
    { icon: <Person />, name: "Profile", func: account },
    {
      icon: (
        <RemoveShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart (${cartItems.length})`,
      func: cart,
    },

    {
      icon: <ExitToApp />,
      name: "Logout",
      func: logoutUser,
    },
  ];

  if (user.role === "admin") {
    options.unshift({
      icon: <Dashboard />,
      name: "Dashboard",
      func: dashboard,
    });
  }
  return (
    <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        className="speedDial"
        style={{ zIndex: "11" }}
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        icon={
          <img
            className="SpeedDialIcon"
            src={user.avatar.url ? user.avatar.url : "Profile.png"}
            alt="profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </>
  );
};

export default UserOptions;

import React, { Fragment, useEffect } from "react";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getUserDetails,deleteUser } from "../../actions/userActions";
import { useAlert } from "react-alert";
import { Delete, Edit } from "@mui/icons-material";
import Sidebar from "./Sidebar";
import {
  deleteProduct,
  getAllProdcts,
} from "../../../../backend/controllers/productController";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { DELETE_USER_RESET } from "../../constants/userConstant";

const UsersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error,  users } = useSelector((state) => state.allUsers);
  const { error:deleteError, isDeleted,isUpdated, message } = useSelector((state) => state.profile);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 180, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 350, flex: 1 },
    {
      field: "stock",
      type: "number",
      headerName: "Stock",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },
    {
      field: "actions",
      headerName: "Action",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <Edit />
            </Link>
            <Button>
              <Delete
                onClick={deleteUserHandler(params.getValue(params.id, "id"))}
              />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  users &&
    users.forEach((item) => {
      rows.push({
        id: item.id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  useEffect(() => {
    dispatch(getUserDetails());
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Product Deleted Successfully");
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted, navigate]);

  return (
    <Fragment>
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Products</h1>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            disableRowSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};
export default UsersList;

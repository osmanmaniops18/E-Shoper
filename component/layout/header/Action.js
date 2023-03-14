import  React,{useState} from 'react';
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import "./header.css";



export default function Action({user}) {
  const { cartItems } = useSelector((state) => state.cart);
    const[open,setOpen]=useState(false);
    let navigate = useNavigate();
    const alert=useAlert();
    const dispatch = useDispatch();

    
const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}/>), name: `Cart(${cartItems.length})`,func: cart, },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
];
if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }
    function dashboard() {
        navigate("/admin/dashboard");
      }
    
      function orders() {
        navigate("/orders");
      }
      function account() {
        navigate("/account");
      }
      function cart() {
        navigate("/Cart");
      }
      function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
      }
  return (
     <>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', top: "3vmax", right: "3vmax" }}
        direction="down"
        style={{ zIndex: "11" }}
        icon={<img
            className="speedDialIcon"
            src={user.avatar.url ? user.avatar.url : "public/Profile.png"}
            alt="Profile"
          />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
       
      >
        {options.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
</>
  );
}
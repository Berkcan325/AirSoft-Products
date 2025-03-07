import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Favorites from "../pages/Favorites";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoutes from "./ProtectedRoutes";
import AddProducts from "../admin/AddProducts";
import AllProducts from "../admin/AllProducts";
import Orders from "../admin/Orders";
import Dashboard from "../admin/Dashboard";
import Users from "../admin/Users";
import ForgottenPass from "../pages/ForgottenPass";
import ResetPass from "../pages/ResetPass";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home" element={<Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="profile" element={<Profile />} />
      <Route path="forgotten" element={<ForgottenPass />} />
      <Route path="sendPasswordResetEmail" element={<ResetPass />} />
      <Route path="cart" element={<Cart />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="shop/:id" element={<ProductDetails />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="/*" element={<ProtectedRoutes />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="dashboard/add-products" element={<AddProducts />} />
        <Route path="dashboard/all-products" element={<AllProducts />} />
        <Route path="dashboard/orders" element={<Orders />} />
        <Route path="dashboard/users" element={<Users />} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
};

export default Routers;

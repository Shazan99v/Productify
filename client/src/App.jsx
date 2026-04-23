import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Pages */
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/auth/Signup";
import VerifyOtp from "./pages/auth/VerifyOtp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/Forgot";
import ResetPassword from "./pages/auth/Reset";

import AddProducts from "./pages/AddProducts";
import Products from "./components/Home/Products";
import ProductDetails from "./pages/ProductDetails"; // ✅ import details page

/* Components */
import ProtectedRoute from "./utils/ProtectedRoutes";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/cart" element={<Cart />} />

        {/* Public Products Page */}
        <Route path="/products" element={<Products />} />

        {/* Product Details */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Protected Route */}
        <Route
          path="/add-products"
          element={
            <ProtectedRoute>
              <AddProducts />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-20 text-xl font-bold">
              Page Not Found
            </h1>
          }
        />
      </Routes>
    </>
  );
};

export default App;
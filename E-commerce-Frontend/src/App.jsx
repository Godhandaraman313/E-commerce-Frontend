import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderCompleted from "./pages/OrderCompleted";

import AddressForm from "./pages/AddressForm";
import AddressList from "./pages/AddressList";

import AccountForm from "./pages/AccountForm";
import MessagePage from "./pages/MessagePage";

import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Layout>
      <Routes>

        {/* ✅ CRITICAL FIX */}
        <Route path="/" element={<Home />} />

        {/* Public */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/products" element={<ProductList />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-completed" element={<OrderCompleted />} />
          <Route path="/address/new" element={<AddressForm />} />
          <Route path="/address-book" element={<AddressList />} />
          <Route path="/account" element={<AccountForm />} />
          <Route path="/message" element={<MessagePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Layout>
  );
}

export default App;
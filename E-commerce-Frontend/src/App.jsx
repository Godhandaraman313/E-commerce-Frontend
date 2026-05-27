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
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import MyReviews from "./pages/MyReviews";
import MyOrders from "./pages/MyOrders";
import OrderDetail from "./pages/OrderDetail";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminOrders from "./pages/admin/AdminOrders";
import BrandList from "./pages/admin/BrandList";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderCompleted from "./pages/OrderCompleted";

import AddressBookPage from "./pages/AddressBookPage";
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

        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Protected */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/brands" element={<BrandList />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-completed" element={<OrderCompleted />} />
          <Route path="/address/new" element={<AddressBookPage />} />
          <Route path="/address/edit/:id" element={<AddressBookPage />} />
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
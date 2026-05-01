// ShoppingCart.jsx  (from shopping_cart.html :contentReference[oaicite:1]{index=1})

import { useEffect, useState } from "react";
//import Header from "../components/Header";
//import SearchNav from "../components/SearchNav";
import { CartAPI } from "../api/ApiServices.js";
//import Footer from "../components/Footer";
import QuantityControl from "../components/QuantityControl";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    CartAPI.get()
    .then(res => {
      setCartItems(res.data.items || []);
      setTotal(res.data.total || 0);
    })
    .catch(console.error);
}, []);
  const updateQuantity = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === id
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.product.id !== id));
  };

  return (
    <div className="container-fluid">
      <Header />
      <SearchNav />

      <div className="text-center">
        <h2>Your Shopping Cart</h2>
      </div>

      <div className="row m-1">

        {/* Cart Items */}
        <div className="col-sm-8">
          {cartItems.map((item, index) => {
            const product = item.product;

            return (
              <div key={product.id} className="row border rounded p-1 mb-2">

                <div className="col-1 text-center">
                  <div>{index + 1}</div>
                  <button
                    className="btn btn-sm btn-danger mt-1"
                    onClick={() => removeItem(product.id)}
                  >
                    🗑
                  </button>
                </div>

                <div className="col-3">
                  <img src={product.mainImagePath} className="img-fluid" alt="" />
                </div>

                <div className="col-6">
                  <div>
                    <b>{product.shortName}</b>
                  </div>

                  <QuantityControl
                    value={item.quantity}
                    onIncrease={() => updateQuantity(product.id, 1)}
                    onDecrease={() => updateQuantity(product.id, -1)}
                  />

                  <div>
                    X ₹{product.price}
                  </div>

                  <div>
                    = <span className="h4">
                      ₹{item.quantity * product.price}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Total Section */}
        <div className="col-sm-4">
          {cartItems.length > 0 && (
            <div>
              <h3>Estimated Total:</h3>
              <h2>₹{total}</h2>

              <button className="btn btn-danger p-3 mt-2">
                Checkout
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Empty Cart */}
      {cartItems.length === 0 && (
        <div className="text-center">
          <h3>You have not chosen any products yet.</h3>
        </div>
      )}

      <Footer />
    </div>
  );
}
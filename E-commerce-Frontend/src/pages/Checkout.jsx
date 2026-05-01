import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Checkout() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/api/checkout")
      .then(res => setData(res.data))
      .catch(() => {
        setData({
          shippingAddress: "Demo Address",
          checkoutInfo: {
            deliverDays: 3,
            deliverDate: "Tomorrow",
            codSupported: true,
            productTotal: 1000,
            shippingCostTotal: 50,
            paymentTotal: 1050
          },
          cartItems: []
        });
      });
  }, []);

  const placeCODOrder = () => {
    API.post("/api/orders", { method: "COD" })
      .then(() => {
        alert("Order placed");
        navigate("/order-completed"); // ✅ FIX
      })
      .catch(() => alert("Order failed"));
  };

  if (!data) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <div className="container-fluid">

      <div className="text-center">
        <h2>Checkout</h2>
      </div>

      <div className="row m-1">

        <div className="col-sm-8">

          <div className="card">
            <div className="card-header"><h5>Shipping Info</h5></div>
            <div className="card-body">
              <p><b>{data.shippingAddress}</b></p>
              <p>{data.checkoutInfo?.deliverDays} days</p>
              <p>{data.checkoutInfo?.deliverDate}</p>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header"><h5>Payment</h5></div>
            <div className="card-body">

              {data.checkoutInfo?.codSupported && (
                <button className="btn btn-primary" onClick={placeCODOrder}>
                  Place COD Order
                </button>
              )}

              <button className="btn btn-warning mt-2">
                Pay with PayPal
              </button>

            </div>
          </div>

        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-header"><h5>Summary</h5></div>
            <div className="card-body">

              {data.cartItems?.map(item => (
                <div key={item.product?.id}>
                  {item.quantity} x {item.product?.shortName}
                </div>
              ))}

              <hr />

              <div>Total: ₹{data.checkoutInfo?.paymentTotal}</div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
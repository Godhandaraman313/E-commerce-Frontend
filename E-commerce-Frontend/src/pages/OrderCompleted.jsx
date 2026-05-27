import { Link } from "react-router-dom";

export default function OrderCompleted() {
  return (
    <div className="container-fluid">
      <div className="text-center border border-secondary rounded m-3 p-5">
        <h2>Your Order has been Completed!</h2>
        <h4 className="mt-3">Thank you for shopping with Kaimart.</h4>
        <p className="text-muted">Your cart has been cleared after placing the order.</p>
        <div className="mt-4 d-flex gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-outline-secondary">
            My Orders
          </Link>
          <Link to="/" className="btn btn-outline-secondary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// OrderCompleted.jsx  (from order_completed.html :contentReference[oaicite:1]{index=1})

//import Header from "../components/Header";
//import SearchNav from "../components/SearchNav";
//mport Footer from "../components/Footer";

export default function OrderCompleted() {
  return (
    <div className="container-fluid">
      <Header />
      <SearchNav />

      <div className="text-center border border-secondary rounded m-3 p-3">
        <h2>Your Order has been Completed!</h2>
        <h4>A confirmation email has been sent to you.</h4>
        <h4>Kindly check your email for the details.</h4>
      </div>

      <Footer />
    </div>
  );
}
// MessagePage.jsx  (from message.html :contentReference[oaicite:2]{index=2})

//import Header from "../components/Header";
//import Footer from "../components/Footer";

export default function MessagePage({ title, message }) {
  return (
    <div className="container-fluid text-center">
      <Header />

      {title && <h2>{title}</h2>}
      {message && <h3>{message}</h3>}

      <Footer />
    </div>
  );
}
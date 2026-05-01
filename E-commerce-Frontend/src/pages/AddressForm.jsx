import { useEffect, useState } from "react";
import { CountryAPI } from "../api/ApiServices.js";
//import Header from "../components/Header";
//import Footer from "../components/Footer";

export default function AddressForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    defaultForShipping: false,
    ...initialData
  });

  const [countries, setCountries] = useState([]);


useEffect(() => {
  CountryAPI.getAll()
    .then(res => setCountries(res.data))
    .catch(() => alert("Failed to load countries"));
}, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
  };

  return (
    <div className="container-fluid">

      {/* <Header /> */}

      <div className="text-center">
        <h2>{form.id ? "Edit Address" : "Add New Address"}</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="border border-secondary rounded p-3">

          <input name="firstName" value={form.firstName} onChange={handleChange} className="form-control mb-2" required />
          <input name="lastName" value={form.lastName} onChange={handleChange} className="form-control mb-2" required />
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="form-control mb-2" required />
          <input name="addressLine1" value={form.addressLine1} onChange={handleChange} className="form-control mb-2" required />
          <input name="addressLine2" value={form.addressLine2} onChange={handleChange} className="form-control mb-2" />
          <input name="city" value={form.city} onChange={handleChange} className="form-control mb-2" required />

          <select name="country" value={form.country} onChange={handleChange} className="form-control mb-2">
            {countries.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input name="state" value={form.state} onChange={handleChange} className="form-control mb-2" />
          <input name="postalCode" value={form.postalCode} onChange={handleChange} className="form-control mb-2" required />

          <button className="btn btn-primary w-100">Save</button>

        </div>
      </form>

      {/* <Footer /> */}
    </div>
  );
}
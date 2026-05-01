import { useEffect, useState } from "react";
//import Header from "../components/Header";
import { AccountAPI, CountryAPI } from "../api/ApiServices.js";

export default function AccountForm() {
  const [form, setForm] = useState({});
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      AccountAPI.getAccount(),
      CountryAPI.getAll()
    ])
      .then(([acc, countries]) => {
        setForm(acc.data);
        setCountries(countries.data);
      })
      .catch(() => alert("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ FIX ADDED
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AccountAPI.updateAccount(form);
      setMessage("Account updated successfully");
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container-fluid">

      {/* <Header /> */}

      <h2 className="text-center">Your Account Details</h2>

      {message && (
        <div className="alert alert-success text-center">{message}</div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
        <div className="border p-3">

          <input name="email" value={form.email || ""} readOnly className="form-control mb-2" />

          <input name="firstName" value={form.firstName || ""} onChange={handleChange} className="form-control mb-2" required />

          <input name="lastName" value={form.lastName || ""} onChange={handleChange} className="form-control mb-2" required />

          <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} className="form-control mb-2" />

          <input name="addressLine1" value={form.addressLine1 || ""} onChange={handleChange} className="form-control mb-2" />

          <input name="city" value={form.city || ""} onChange={handleChange} className="form-control mb-2" />

          <select name="country" value={form.country || ""} onChange={handleChange} className="form-control mb-2">
            {countries.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input name="postalCode" value={form.postalCode || ""} onChange={handleChange} className="form-control mb-2" />

          <button className="btn btn-primary w-100">Update</button>

        </div>
      </form>

    </div>
  );
}
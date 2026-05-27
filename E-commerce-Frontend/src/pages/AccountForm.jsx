import { useEffect, useState } from "react";
import { AccountAPI, CountryAPI } from "../api/ApiServices.js";
import "../styles/global.css"; // Ensure global styles apply

export default function AccountForm() {
  const [form, setForm] = useState({});
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

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
      setIsEditing(false);
    } catch {
      alert("Update failed");
    }
  };

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container-fluid py-4" style={{ maxWidth: 800 }}>
      <h2 className="mb-4 text-center fw-bold" style={{ letterSpacing: "1px" }}>PROFILE DETAILS</h2>

      {message && (
        <div className="alert alert-success text-center rounded-0 shadow-sm">{message}</div>
      )}

      <div className="card shadow-sm border-0 rounded-0">
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-semibold text-uppercase" style={{ fontSize: "0.9rem" }}>Account Information</h5>
          {!isEditing && (
            <button className="btn btn-outline-dark btn-sm rounded-0 px-4" onClick={() => setIsEditing(true)}>
              EDIT PROFILE
            </button>
          )}
        </div>
        <div className="card-body p-4">
          {!isEditing ? (
            <div className="row g-4">
              <div className="col-md-6 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>First Name</span>
                <span className="fw-medium">{form.firstName || "—"}</span>
              </div>
              <div className="col-md-6 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Last Name</span>
                <span className="fw-medium">{form.lastName || "—"}</span>
              </div>
              <div className="col-md-6 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Email ID</span>
                <span className="fw-medium">{form.email || "—"}</span>
              </div>
              <div className="col-md-6 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Mobile Number</span>
                <span className="fw-medium">{form.phoneNumber || "—"}</span>
              </div>
              <div className="col-md-12 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Address Line 1</span>
                <span className="fw-medium">{form.addressLine1 || "—"}</span>
              </div>
              <div className="col-md-4 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>City</span>
                <span className="fw-medium">{form.city || "—"}</span>
              </div>
              <div className="col-md-4 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Postal Code</span>
                <span className="fw-medium">{form.postalCode || "—"}</span>
              </div>
              <div className="col-md-4 border-bottom pb-3">
                <span className="text-muted d-block text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>Country</span>
                <span className="fw-medium">
                  {countries.find(c => c.id.toString() === form.country?.toString())?.name || form.country || "—"}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>First Name</label>
                <input name="firstName" value={form.firstName || ""} onChange={handleChange} className="form-control rounded-0" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Last Name</label>
                <input name="lastName" value={form.lastName || ""} onChange={handleChange} className="form-control rounded-0" required />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Email ID</label>
                <input name="email" value={form.email || ""} readOnly className="form-control rounded-0 bg-light" />
              </div>
              <div className="col-md-6">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Mobile Number</label>
                <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} className="form-control rounded-0" />
              </div>
              <div className="col-12">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Address Line 1</label>
                <input name="addressLine1" value={form.addressLine1 || ""} onChange={handleChange} className="form-control rounded-0" />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>City</label>
                <input name="city" value={form.city || ""} onChange={handleChange} className="form-control rounded-0" />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Postal Code</label>
                <input name="postalCode" value={form.postalCode || ""} onChange={handleChange} className="form-control rounded-0" />
              </div>
              <div className="col-md-4">
                <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Country</label>
                <select name="country" value={form.country || ""} onChange={handleChange} className="form-control rounded-0">
                  <option value="">Select</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 mt-4 d-flex gap-2">
                <button type="submit" className="btn btn-dark rounded-0 px-4">SAVE DETAILS</button>
                <button type="button" className="btn btn-outline-secondary rounded-0 px-4" onClick={() => setIsEditing(false)}>CANCEL</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
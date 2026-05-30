import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import indiaStatesDistricts from "../data/indiaStatesDistricts";

const COUNTRY = "India";

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
    district: "",
    postalCode: "",
    country: COUNTRY,
    defaultForShipping: false,
    ...initialData,
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm((prev) => ({ ...prev, ...initialData, country: COUNTRY }));
    }
  }, [initialData]);

  const districts = useMemo(() => {
    const entry = indiaStatesDistricts.find((s) => s.state === form.state);
    return entry ? entry.districts : [];
  }, [form.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset district when state changes
      ...(name === "state" ? { district: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(form);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 700 }}>
      <button type="button" className="btn btn-link text-decoration-none text-dark ps-0 mb-3 fw-medium" onClick={() => window.history.back()}>
        ← BACK TO ADDRESS BOOK
      </button>

      <h3 className="mb-4 fw-bold" style={{ letterSpacing: "1px" }}>
        {form.id ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
      </h3>

      <div className="card shadow-sm border-0 rounded-0 p-4 bg-white">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>First Name *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Last Name *</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Mobile Number *</label>
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Postal Code *</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Address Line 1 *</label>
            <input
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Address Line 2 (Optional)</label>
            <input
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              className="form-control rounded-0"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>City *</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="form-control rounded-0"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>State *</label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className="form-select rounded-0"
              required
            >
              <option value="">Select State</option>
              {indiaStatesDistricts.map((s) => (
                <option key={s.state} value={s.state}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>District *</label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="form-select rounded-0"
              required
              disabled={!form.state}
            >
              <option value="">
                {form.state ? "Select District" : "Select State First"}
              </option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label text-muted text-uppercase" style={{ fontSize: "0.75rem" }}>Country</label>
            <input
              value={COUNTRY}
              readOnly
              className="form-control rounded-0 bg-light text-muted fw-semibold"
            />
          </div>

          <div className="col-12 mt-4">
            <label className="d-flex align-items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="defaultForShipping"
                checked={form.defaultForShipping}
                onChange={handleChange}
                style={{ width: "18px", height: "18px" }}
              />
              <span className="fw-medium text-dark">Make this my default shipping address</span>
            </label>
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-dark w-100 py-3 rounded-0 fs-6">
              SAVE ADDRESS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

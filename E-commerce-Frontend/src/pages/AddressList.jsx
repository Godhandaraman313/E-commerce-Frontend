import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AddressAPI } from "../api/ApiServices";

export default function AddressList() {

  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // Load Addresses
  // =========================
  const load = async () => {
    try {

      setLoading(true);

      const res = await AddressAPI.getAll();

      const data = res.data || {};

      // Expected backend response:
      // {
      //   primaryAddress: {},
      //   addresses: []
      // }

      const addressesList =
        data.addresses ??
        data.content ??
        (Array.isArray(data) ? data : []) ??
        [];

      setAddresses(addressesList);

      setPrimaryAddress(
        data.primaryAddress ??
        data.primary ??
        null
      );

    } catch (error) {

      console.error("Failed to load addresses", error);
      alert("Failed to load addresses");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // Delete Address
  // =========================
  const confirmDelete = async () => {

    try {

      await AddressAPI.delete(confirmId);

      setConfirmId(null);

      await load();

    } catch (error) {

      console.error("Delete failed", error);
      alert("Delete failed");

    }
  };

  // =========================
  // Set Default Address
  // =========================
  const setDefault = async (addressId) => {

    try {

      await AddressAPI.setDefault(addressId);

      await load();

    } catch (error) {

      console.error("Failed to set default address", error);
      alert("Failed to set default address");

    }
  };

  // =========================
  // Helpers
  // =========================
  const otherAddresses = addresses.filter(
    (address) => address.id !== primaryAddress?.id
  );

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const handleSetDefault = (id) => {
    setDefault(id);
  };

  // =========================
  // Loading UI
  // =========================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-muted">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 1000 }}>

      {/* Header */}
      <h3
        className="mb-4 fw-bold"
        style={{ letterSpacing: "1px" }}
      >
        SAVED ADDRESSES
      </h3>

      {/* Top Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <p className="text-muted mb-0">
          Manage your shipping addresses below.
        </p>

        <Link
          to="/address/new"
          className="btn btn-outline-dark btn-sm px-4 rounded-0 fw-semibold"
        >
          + ADD NEW ADDRESS
        </Link>

      </div>

      {/* Empty State */}
      {addresses.length === 0 && !primaryAddress && (
        <div className="text-center py-5 border bg-light">
          <h5 className="fw-semibold mb-2">
            No saved addresses found
          </h5>

          <p className="text-muted">
            Add a new shipping address to continue.
          </p>

          <Link
            to="/address/new"
            className="btn btn-dark rounded-0 px-4"
          >
            ADD ADDRESS
          </Link>
        </div>
      )}

      {/* Address Cards */}
      <div className="row g-4">

        {/* Default Address */}
        {primaryAddress && (
          <div className="col-md-6">

            <div className="card h-100 border-dark shadow-sm rounded-0">

              <div className="card-body p-4 position-relative">

                <span className="badge bg-dark position-absolute top-0 end-0 m-3 rounded-0">
                  DEFAULT
                </span>

                <h6 className="fw-bold mb-3">
                  {primaryAddress.firstName}{" "}
                  {primaryAddress.lastName}
                </h6>

                <div className="text-muted small lh-lg mb-4">

                  {primaryAddress.addressLine1}
                  <br />

                  {primaryAddress.addressLine2 && (
                    <>
                      {primaryAddress.addressLine2}
                      <br />
                    </>
                  )}

                  {primaryAddress.city},{" "}
                  {primaryAddress.district && <>{primaryAddress.district}, </>}
                  {primaryAddress.state}
                  <br />

                  {"India"} -{" "}
                  {primaryAddress.postalCode}
                  <br />

                  Mobile:{" "}
                  <span className="fw-medium text-dark">
                    {primaryAddress.phoneNumber}
                  </span>

                </div>

                <div className="d-flex gap-3 border-top pt-3">

                  <Link
                    to={`/address/edit/${primaryAddress.id}`}
                    className="text-primary fw-semibold text-decoration-none small"
                  >
                    EDIT
                  </Link>

                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 fw-semibold text-decoration-none small"
                    onClick={() => handleDelete(primaryAddress.id)}
                  >
                    REMOVE
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Other Addresses */}
        {otherAddresses.map((address) => (

          <div className="col-md-6" key={address.id}>

            <div className="card h-100 border-0 shadow-sm rounded-0 bg-light">

              <div className="card-body p-4 position-relative">

                <h6 className="fw-bold mb-3">
                  {address.firstName}{" "}
                  {address.lastName}
                </h6>

                <div className="text-muted small lh-lg mb-4">

                  {address.addressLine1}
                  <br />

                  {address.addressLine2 && (
                    <>
                      {address.addressLine2}
                      <br />
                    </>
                  )}

                  {address.city},{" "}
                  {address.district && <>{address.district}, </>}
                  {address.state}
                  <br />

                  {"India"} -{" "}
                  {address.postalCode}
                  <br />

                  Mobile:{" "}
                  <span className="fw-medium text-dark">
                    {address.phoneNumber}
                  </span>

                </div>

                <div className="d-flex gap-3 border-top pt-3 border-secondary border-opacity-25">

                  <Link
                    to={`/address/edit/${address.id}`}
                    className="text-primary fw-semibold text-decoration-none small"
                  >
                    EDIT
                  </Link>

                  <button
                    type="button"
                    className="btn btn-link text-danger p-0 fw-semibold text-decoration-none small"
                    onClick={() => handleDelete(address.id)}
                  >
                    REMOVE
                  </button>

                  <button
                    type="button"
                    className="btn btn-link text-dark p-0 fw-semibold text-decoration-none ms-auto small"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    SET AS DEFAULT
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Delete Confirmation Modal */}
      {confirmId && (

        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >

          <div className="modal-dialog">

            <div className="modal-content rounded-0">

              <div className="modal-header">

                <h5 className="modal-title">
                  Delete Confirmation
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmId(null)}
                />

              </div>

              <div className="modal-body">

                Are you sure you want to delete this address?

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-success rounded-0"
                  onClick={confirmDelete}
                >
                  Yes
                </button>

                <button
                  type="button"
                  className="btn btn-danger rounded-0"
                  onClick={() => setConfirmId(null)}
                >
                  No
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import Header from "../components/Header";
//import SearchNav from "../components/SearchNav";
import { AddressAPI } from "../api/ApiServices.js";
//import Footer from "../components/Footer";

export default function AddressList() {
  const [addresses, setAddresses] = useState([]);
  const [primaryAddress, setPrimaryAddress] = useState(null);
  const [confirmId, setConfirmId] = useState(null);


useEffect(() => {
  AddressAPI.getAll()
    .then(res => {
      setAddresses(res.data.addresses || []);
      setPrimaryAddress(res.data.primary || null);
    })
    .catch(() => alert("Failed to load addresses"));
}, []);

const confirmDelete = async () => {
  try {
    await AddressAPI.delete(confirmId);
    setAddresses(prev => prev.filter(a => a.id !== confirmId));
    setConfirmId(null);
  } catch {
    alert("Delete failed");
  }
};
  return (
    <div className="container-fluid">

      {/* <Header /> */}
      {/* <SearchNav /> */}

      <div className="text-center">
        <h2>Your Address Book</h2>
        <Link to="/address/new" className="h4">Add New Address</Link>
      </div>

      <div className="row m-1">

        {primaryAddress && (
          <div className="col-sm-6 mt-2">
            <div className="card bg-warning">
              <div className="card-header"><b>Your Primary Address</b></div>
              <div className="card-body">
                {primaryAddress.fullName}<br />
                {primaryAddress.addressLine1}<br />
                {primaryAddress.city}
              </div>
            </div>
          </div>
        )}

        {addresses.map((address, index) => (
          <div key={address.id} className="col-sm-6 mt-2">
            <div className={`card ${address.defaultForShipping ? "bg-warning" : ""}`}>
              
              <div className="card-header d-flex justify-content-between">
                <b>Address #{index + 1}</b>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setConfirmId(address.id)}
                >
                  Delete
                </button>
              </div>

              <div className="card-body">
                {address.fullName}<br />
                {address.addressLine1}<br />
                {address.city}
              </div>

            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Delete Confirmation</h5>
                <button className="btn-close" onClick={() => setConfirmId(null)}></button>
              </div>

              <div className="modal-body">
                Are you sure?
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={confirmDelete}>Yes</button>
                <button className="btn btn-danger" onClick={() => setConfirmId(null)}>No</button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* <Footer /> */}
    </div>
  );
}
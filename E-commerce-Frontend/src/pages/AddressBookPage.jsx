import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddressForm from "./AddressForm";
import { AddressAPI } from "../api/ApiServices";

export default function AddressBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    AddressAPI.getById(id)
      .then((res) => {
        const a = res.data;
        setInitialData({
          id: a.id,
          firstName: a.firstName,
          lastName: a.lastName,
          phoneNumber: a.phoneNumber || "",
          addressLine1: a.addressLine1,
          addressLine2: a.addressLine2 || "",
          city: a.city,
          state: a.state || "",
          district: a.district || "",
          postalCode: a.postalCode,
          country: "India",
          defaultForShipping: a.defaultForShipping,
        });
      })
      .catch(() => alert("Address not found"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (form) => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      addressLine1: form.addressLine1,
      addressLine2: form.addressLine2 || "",
      city: form.city,
      state: form.state || "",
      district: form.district || "",
      postalCode: form.postalCode,
      country: "India",
      defaultForShipping: form.defaultForShipping,
    };

    try {
      if (isEdit) {
        await AddressAPI.update(id, payload);
      } else {
        await AddressAPI.create(payload);
      }
      navigate("/address-book");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save address");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return <AddressForm initialData={initialData || {}} onSubmit={handleSubmit} />;
}

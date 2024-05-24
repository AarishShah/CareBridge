import React from "react";

function Address({ address, updateField }) {
  const handleChange = (fieldName, value) => {
    updateField({
      address: {
        ...address,
        [fieldName]: value,
      },
    });
  };

  return (
    <>
      <label>State</label>
      <input
        type="text"
        value={address.state}
        onChange={(e) => handleChange("state", e.target.value)}
        autoFocus
        required
      />
      <label>City</label>
      <input
        type="text"
        value={address.city}
        onChange={(e) => handleChange("city", e.target.value)}
        required
      />
      <label>Street</label>
      <input
        type="text"
        value={address.street}
        onChange={(e) => handleChange("street", e.target.value)}
        required
      />
      <label>Pincode</label>
      <input
        type="text"
        value={address.pinCode}
        onChange={(e) => handleChange("pinCode", e.target.value)}
        required
      />
    </>
  );
}

export default Address;

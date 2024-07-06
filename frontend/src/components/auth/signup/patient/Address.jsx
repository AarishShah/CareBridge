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
    <div className="flex flex-col items-center mt-16 mb-2 w-full">
    <h1 className="text-xl font-bold mb-12 ">Address Details</h1>

      <div className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">State</label>
      <input
        type="text"
        value={address.state}
        onChange={(e) => handleChange("state", e.target.value)}
        autoFocus
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your state..."
      />

      </div>
      
      <div className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
      <input
        type="text"
        value={address.city}
        onChange={(e) => handleChange("city", e.target.value)}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your city..."
      />

      </div>

      <div className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">Street</label>
      <input
        type="text"
        value={address.street}
        onChange={(e) => handleChange("street", e.target.value)}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your street..."
      />

      </div>

      <div className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">Pincode</label>
      <input
        type="text"
        value={address.pinCode}
        onChange={(e) => handleChange("pinCode", e.target.value)}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Your pincode..."
      />

      </div>
     
     
    </div>
  );
}

export default Address;

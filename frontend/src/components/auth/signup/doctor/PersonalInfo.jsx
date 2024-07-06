import React from "react";

function PersonalInfo({ name, gender, updateField }) {
  return (
    <div  className="flex flex-col items-center mt-16 mb-12 w-full">
      <h1 className="text-xl font-bold mb-12">Personal Information</h1>
      <div className="w-2/3 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => updateField({ name: e.target.value })}
          autoFocus
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          // required
        />
      </div>
      <div className="w-2/3 mb-4 mt-4">
        <label className="block text-gray-700 text-sm font-bold">Gender</label>
        <select
          value={gender}
          onChange={(e) => updateField({ gender: e.target.value })}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="male/female/others..."
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
    </div>
  );
}

export default PersonalInfo;

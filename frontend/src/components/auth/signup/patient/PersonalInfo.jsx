import React from "react";
import { useLocation } from "react-router-dom";

function PersonalInfo({
  name,
  DOB,
  gender,
  maritalStatus,
  occupation,
  updateField,
}) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col items-center mt-10 mb-6 w-full">
      <h1 className="text-xl font-bold mb-6 mr-60">Personal Information</h1>

      <div className="w-2/3 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => updateField({ name: e.target.value })}
          autoFocus
          // required
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
        />
      </div>

      <div  className="w-2/3 mb-4">
        {pathname !== "/patient/edit" && (
          <>
            <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
            <input
              type="date"
              value={DOB}
              onChange={(e) => updateField({ DOB: e.target.value })}
              // required
              className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </>
        )}
      </div>

      <div  className="w-2/3 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
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

      <div  className="w-2/3 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Marital Status</label>
        <select
          value={maritalStatus}
          onChange={(e) => updateField({ maritalStatus: e.target.value })}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Unmarried">Unmarried</option>
          <option value="Married">Married</option>
        </select>
      </div>

      <div  className="w-2/3">
        <label className="block text-gray-700 text-sm font-bold mb-2">Occupation</label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => updateField({ occupation: e.target.value })}
          // required
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your occupation..."
        />
      </div>
    </div>
  );
}

export default PersonalInfo;

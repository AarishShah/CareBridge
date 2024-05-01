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
    <>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => updateField({ name: e.target.value })}
        autoFocus
        required
      />
      {pathname !== "/patient/edit" && (
        <>
          <label>Date of Birth</label>
          <input
            type="date"
            value={DOB}
            onChange={(e) => updateField({ DOB: e.target.value })}
            required
          />
        </>
      )}
      <label>Gender</label>
      <select
        value={gender}
        onChange={(e) => updateField({ gender: e.target.value })}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
      <label>Marital Status</label>
      <select
        value={maritalStatus}
        onChange={(e) => updateField({ maritalStatus: e.target.value })}
      >
        <option value="Unmarried">Unmarried</option>
        <option value="Married">Married</option>
      </select>
      <label>Occupation</label>
      <input
        type="text"
        value={occupation}
        onChange={(e) => updateField({ occupation: e.target.value })}
        required
      />
    </>
  );
}

export default PersonalInfo;

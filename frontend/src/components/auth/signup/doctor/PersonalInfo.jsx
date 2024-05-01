import React from "react";

function PersonalInfo({ name, gender, updateField }) {
  return (
    <>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => updateField({ name: e.target.value })}
        autoFocus
        // required
      />
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
    </>
  );
}

export default PersonalInfo;

import React from "react";

function ProfessionalInfo({
  specialization,
  yearsOfExperience,
  qualifications,
  updateField,
}) {
  return (
    <>
      <label>Specialization</label>
      <input
        type="text"
        placeholder="Add separator using commas"
        value={specialization}
        onChange={(e) => {
          updateField({ specialization: e.target.value });
        }}
        autoFocus
        // required
      />
      <label>Years of Experience</label>
      <input
        type="number"
        value={yearsOfExperience}
        onChange={(e) => updateField({ yearsOfExperience: e.target.value })}
        min={1}
        // required
      />
      <label>Qualifications</label>
      <input
        type="text"
        placeholder="Add separator using commas"
        value={qualifications}
        onChange={(e) => updateField({ qualifications: e.target.value })}
        // required
      />
    </>
  );
}

export default ProfessionalInfo;

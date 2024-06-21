import React from "react";

function Title({ formData, updateFields }) {
  const { title, biodata } = formData.medicalHistory;

  return (
    <div>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        value={title}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              title: event.target.value,
            },
          })
        }
        autoFocus
        required
      />
      <label htmlFor="modeOfAdmission">Mode of Admission</label>
      <select
        name="modeOfAdmission"
        id="modeOfAdmission"
        value={biodata.modeOfAdmission}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              biodata: {
                ...formData.medicalHistory.biodata,
                modeOfAdmission: event.target.value,
              },
            },
          })
        }
      >
        <option value="Emergency">Emergency</option>
        <option value="Outpatient">Outpatient</option>
      </select>
    </div>
  );
}

export default Title;

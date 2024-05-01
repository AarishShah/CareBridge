function OtherHistory({ formData, updateFields }) {
  const {
    pastSurgicalHistory,
    pastMedicalHistory,
    familyHistory,
    drugHistory,
    allergies,
    gynecologicalHistory,
    occupationalHistory,
    travelHistory,
    socioeconomicHistory,
  } = formData.medicalHistory;

  return (
    <div>
      <label htmlFor="pastSurgicalHistory">Past Surgical History</label>
      <input
        type="text"
        value={pastSurgicalHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              pastSurgicalHistory: event.target.value,
            },
          })
        }
        autoFocus
      />
      <label htmlFor="pastMedicalHistory">Past Medical History</label>
      <input
        type="text"
        value={pastMedicalHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              pastMedicalHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="familyHistory">Family History</label>
      <input
        type="text"
        value={familyHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              familyHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="allergies">Allergies</label>
      <input
        type="text"
        value={allergies}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              allergies: event.target.value,
            },
          })
        }
      />
      <label htmlFor="drugHistory">Drug History</label>
      <input
        type="text"
        value={drugHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              drugHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="gynecologicalHistory">Gynecological History</label>
      <input
        type="text"
        value={gynecologicalHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              gynecologicalHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="occupationalHistory">Occupational History</label>
      <input
        type="text"
        value={occupationalHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              occupationalHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="travelHistory">Travel History</label>
      <input
        type="text"
        value={travelHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              travelHistory: event.target.value,
            },
          })
        }
      />
      <label htmlFor="socioeconomicHistory">Socio-economic History</label>
      <input
        type="text"
        value={socioeconomicHistory}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              socioeconomicHistory: event.target.value,
            },
          })
        }
      />
    </div>
  );
}

export default OtherHistory;

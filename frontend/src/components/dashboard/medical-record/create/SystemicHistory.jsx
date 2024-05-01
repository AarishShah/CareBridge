function SystemicHistory({ formData, updateFields }) {
  const { systemicHistory } = formData.medicalHistory;

  return (
    <div>
      <label htmlFor="centralNervousSystem">Central Nervous System</label>
      <textarea
        type="text"
        value={systemicHistory.centralNervousSystem}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              systemicHistory: {
                ...formData.medicalHistory.systemicHistory,
                centralNervousSystem: event.target.value,
              },
            },
          })
        }
        autoFocus
      />
      <label htmlFor="cardiovascularSystem">Cardio-vascular System</label>
      <textarea
        type="text"
        value={systemicHistory.cardiovascularSystem}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              systemicHistory: {
                ...formData.medicalHistory.systemicHistory,
                cardiovascularSystem: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="gastrointestinalSystem">Gastro-intestinal System</label>
      <textarea
        type="text"
        value={systemicHistory.gastrointestinalSystem}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              systemicHistory: {
                ...formData.medicalHistory.systemicHistory,
                gastrointestinalSystem: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="genitourinarySystem">Genito-urinary System</label>
      <textarea
        type="text"
        value={systemicHistory.genitourinarySystem}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              systemicHistory: {
                ...formData.medicalHistory.systemicHistory,
                genitourinarySystem: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="musculoskeletalSystem">Musculo-skeletal System</label>
      <textarea
        type="text"
        value={systemicHistory.musculoskeletalSystem}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              systemicHistory: {
                ...formData.medicalHistory.systemicHistory,
                musculoskeletalSystem: event.target.value,
              },
            },
          })
        }
      />
    </div>
  );
}

export default SystemicHistory;

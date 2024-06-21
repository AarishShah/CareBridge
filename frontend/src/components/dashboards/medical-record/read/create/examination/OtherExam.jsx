function OtherExam({ formData, updateFields }) {
  const {
    respiratorySystem,
    centralNervousSystem,
    cardiovascularSystem,
    gastrointestinalSystem,
  } = formData.examination;

  return (
    <div>
      <label htmlFor="respiratorySystem">Respiratory System</label>
      <input
        value={respiratorySystem}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              respiratorySystem: event.target.value,
            },
          })
        }
      />
      <label htmlFor="centralNervousSystem">Central Nervous System</label>
      <input
        value={centralNervousSystem}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              centralNervousSystem: event.target.value,
            },
          })
        }
      />
      <label htmlFor="cardiovascularSystem">Cardio-vascular System</label>
      <input
        value={cardiovascularSystem}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              cardiovascularSystem: event.target.value,
            },
          })
        }
      />
      <label htmlFor="gastrointestinalSystem">Gastro-intestinal System</label>
      <input
        value={gastrointestinalSystem}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              gastrointestinalSystem: event.target.value,
            },
          })
        }
      />
    </div>
  );
}

export default OtherExam;

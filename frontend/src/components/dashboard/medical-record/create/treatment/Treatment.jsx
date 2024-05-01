function Treatment({ formData, updateFields }) {
  const { prescribedDrug, dosage, administrationRoute, dosageFrequency } =
    formData.treatment;

  return (
    <div>
      <label htmlFor="prescribedDrug">Prescribed Drug</label>
      <input
        value={prescribedDrug}
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              prescribedDrug: event.target.value,
            },
          })
        }
      />
      <label htmlFor="dosage">Dosage</label>
      <input
        value={dosage}
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              dosage: event.target.value,
            },
          })
        }
      />
      <label htmlFor="administrationRoute">Administration Route</label>
      <input
        value={administrationRoute}
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              administrationRoute: event.target.value,
            },
          })
        }
      />
      <label htmlFor="dosageFrequency">Dosage Frequency</label>
      <input
        value={dosageFrequency}
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              dosageFrequency: event.target.value,
            },
          })
        }
      />
    </div>
  );
}

export default Treatment;

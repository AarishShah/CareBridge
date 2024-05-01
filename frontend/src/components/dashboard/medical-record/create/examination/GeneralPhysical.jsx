function GeneralPhysical({ formData, updateFields }) {
  const { generalPhysicalExamination } = formData.examination;
  const {
    bloodPressure,
    pulse,
    temperature,
    respiratoryRate,
    bloodSugarLevel,
    Notes,
  } = generalPhysicalExamination;

  return (
    <div>
      <label htmlFor="bloodPressure">Blood Pressure</label>
      <input
        type="text"
        value={bloodPressure}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                bloodPressure: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="pulse">Pulse</label>
      <input
        type="number"
        min={78}
        value={pulse}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                pulse: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="temperature">Temperature</label>
      <input
        value={temperature}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                temperature: `${event.target.value}`,
              },
            },
          })
        }
      />
      <label htmlFor="respiratoryRate">Respiratory Rate</label>
      <input
        type="number"
        min={16}
        value={respiratoryRate}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                respiratoryRate: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="bloodSugarLevel">Blood-sugar Level</label>
      <input
        value={bloodSugarLevel}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                bloodSugarLevel: event.target.value,
              },
            },
          })
        }
      />
      <label htmlFor="notes">Notes</label>
      <input
        value={Notes}
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              generalPhysicalExamination: {
                ...formData.examination.generalPhysicalExamination,
                Notes: event.target.value,
              },
            },
          })
        }
      />
    </div>
  );
}

export default GeneralPhysical;

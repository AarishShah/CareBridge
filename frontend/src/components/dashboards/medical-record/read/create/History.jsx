function History({ formData, updateFields }) {
  const { historyOfPresentingComplaints, historyOfPresentingIllness } =
    formData.medicalHistory;

  return (
    <div>
      <label htmlFor="historyOfPresentingComplaints">
        History of Presenting Complaints
      </label>
      <textarea
        type="text"
        value={historyOfPresentingComplaints}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              historyOfPresentingComplaints: event.target.value,
            },
          })
        }
      />
      <label htmlFor="historyOfPresentingIllness">
        History of Presenting Illness
      </label>
      <textarea
        type="text"
        value={historyOfPresentingIllness}
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              historyOfPresentingIllness: event.target.value,
            },
          })
        }
      />
    </div>
  );
}

export default History;

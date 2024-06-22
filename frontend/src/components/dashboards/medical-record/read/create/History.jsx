function History({ formData, updateFields }) {
  const { historyOfPresentingComplaints, historyOfPresentingIllness } =
    formData.medicalHistory;

  return (
    <div  className="flex flex-col items-center mt-10 mb-6 w-full">
      <h1 className="text-xl font-bold mb-16 ">Patient History</h1>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-lg font-bold mb-2"
 htmlFor="historyOfPresentingComplaints">
        History of Presenting Complaints
      </label>
      <textarea
        type="text"
        value={historyOfPresentingComplaints}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="symptoms..."
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              historyOfPresentingComplaints: event.target.value,
            },
          })
        }
      />
</div>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-lg font-bold mb-2"
 htmlFor="historyOfPresentingIllness">
        History of Presenting Illness
      </label>
      <textarea
        type="text"
        value={historyOfPresentingIllness}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="illnesses..."
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
     
     
    </div>
  );
}

export default History;

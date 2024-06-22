function Treatment({ formData, updateFields }) {
  const { prescribedDrug, dosage, administrationRoute, dosageFrequency } =
    formData.treatment;

  return (
    <div className="flex flex-col items-center mt-10 mb-6 w-full">
    <h1 className="text-xl font-bold mb-6 mr-60">Personal Information</h1>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="prescribedDrug">Prescribed Drug</label>
      <input
        value={prescribedDrug}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              prescribedDrug: event.target.value,
            },
          })
        }
      />
</div>

<div className="w-2/3 mb-4">
<label 
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="dosage">Dosage</label>
      <input
        value={dosage}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              dosage: event.target.value,
            },
          })
        }
      />
</div>
      
      <div className="w-2/3 mb-4">
      <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="administrationRoute">Administration Route</label>
      <input
        value={administrationRoute}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
        onChange={(event) =>
          updateFields({
            treatment: {
              ...formData.treatment,
              administrationRoute: event.target.value,
            },
          })
        }
      />
      </div>
     
    <div className="w-2/3 mb-4">
    <label
    className="block text-gray-700 text-sm font-bold mb-2"
    htmlFor="dosageFrequency">Dosage Frequency</label>
      <input
        value={dosageFrequency}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
     
    </div>
  );
}

export default Treatment;

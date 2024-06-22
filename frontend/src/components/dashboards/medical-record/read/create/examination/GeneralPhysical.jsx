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
    <div className="flex flex-col items-center mb-10 w-full">
    <h1 className="text-xl font-bold mb-8">General Physical Information</h1>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="bloodPressure">Blood Pressure</label>
      <input
        type="text"
        value={bloodPressure}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
</div>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="pulse">Pulse</label>
      <input
        type="number"
        min={78}
        value={pulse}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
</div>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="temperature">Temperature</label>
      <input
        value={temperature}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
</div>
      
      <div className="w-2/3 mb-4">
      <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="respiratoryRate">Respiratory Rate</label>
      <input
        type="number"
        min={16}
        value={respiratoryRate}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      </div>
      
     <div className="w-2/3 mb-4">
     <label
     className="block text-gray-700 text-sm font-bold mb-2"
     htmlFor="bloodSugarLevel">Blood-sugar Level</label>
      <input
        value={bloodSugarLevel}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
     </div>
      
      <div className="w-2/3 mb-4">
      <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="notes">Notes</label>
      <input
        value={Notes}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      
      
    </div>
  );
}

export default GeneralPhysical;

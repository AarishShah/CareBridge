function OtherExam({ formData, updateFields }) {
  const {
    respiratorySystem,
    centralNervousSystem,
    cardiovascularSystem,
    gastrointestinalSystem,
  } = formData.examination;

  return (
    <div className="flex flex-col items-center mt-10 mb-6 w-full">
      <h1 className="text-xl font-bold mb-16">Other Exam</h1>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="respiratorySystem">Respiratory System</label>
      <input
        value={respiratorySystem}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Respiratory System..."
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              respiratorySystem: event.target.value,
            },
          })
        }
      />
</div>

<div className="w-2/3 mb-4">
<label
className="block text-gray-700 text-sm font-bold mb-2"
htmlFor="centralNervousSystem">Central Nervous System</label>
      <input
        value={centralNervousSystem}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="central nervous system..."
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              centralNervousSystem: event.target.value,
            },
          })
        }
      />
</div>
      
      <div className="w-2/3 mb-4">
      <label
      className="block text-gray-700 text-sm font-bold mb-2"
      htmlFor="cardiovascularSystem">Cardio-vascular System</label>
      <input
        value={cardiovascularSystem}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Cardio-vascular System..."
        onChange={(event) =>
          updateFields({
            examination: {
              ...formData.examination,
              cardiovascularSystem: event.target.value,
            },
          })
        }
      />
      </div>
     
     <div className="w-2/3 mb-4">
     <label
     className="block text-gray-700 text-sm font-bold mb-2"
     htmlFor="gastrointestinalSystem">Gastro-intestinal System</label>
      <input
        value={gastrointestinalSystem}
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Gastro-intestinal System..."
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
      
      
    </div>
  );
}

export default OtherExam;

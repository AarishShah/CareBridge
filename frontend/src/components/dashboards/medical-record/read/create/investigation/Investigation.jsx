function Investiagtion({ formData, updateFields }) {
  const {
    completeBloodCount,
    liverFunctionTests,
    renalFunctionTests,
    vitalMarkers,
    serumElectrolytes,
    prothrombinTime,
    activatedPartialThromboplastinTime,
    electrocardiogram,
    chestXRay,
  } = formData.investigations;

  return (
    <div className="flex flex-col items-center mt-10 mb-6 w-full">
      <h1 className="text-xl font-bold mb-6 mr-60">Investigation</h1>
      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="completeBloodCount">Complete Blood Count</label>
        <input
          value={completeBloodCount}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Complete Blood Count..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                completeBloodCount: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="liverFunctionTests">Liver Function Tests</label>
        <input
          value={liverFunctionTests}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Liver Function Tests..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                liverFunctionTests: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="renalFunctionTests">Renal Function Tests</label>
        <input
          value={renalFunctionTests}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Renal Function Tests..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                renalFunctionTests: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="vitalMarkers">Vital Markers</label>
        <input
          value={vitalMarkers}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Vital Markers..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                vitalMarkers: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="serumElectrolytes">Serum Electrolytes</label>
        <input
          value={serumElectrolytes}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Serum Electrolytes..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                serumElectrolytes: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="prothrombinTime">Prothrombin Time</label>
        <input
          value={prothrombinTime}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Prothrombin Time..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                prothrombinTime: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label 
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="activatedPartialThromboplastinTime">
          Activated Partial Thromboplastin Time
        </label>
        <input
          value={activatedPartialThromboplastinTime}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Activated Partial Thromboplastin Time..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                activatedPartialThromboplastinTime: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label 
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="electrocardiogram">Electro-cardiogram</label>
        <input
          value={electrocardiogram}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Electro-cardiogram..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                electrocardiogram: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="chestXRay">Chest XRay</label>
        <input
          value={chestXRay}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Chest XRay..."
          onChange={(event) =>
            updateFields({
              investigations: {
                ...formData.investigations,
                chestXRay: event.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
}

export default Investiagtion;

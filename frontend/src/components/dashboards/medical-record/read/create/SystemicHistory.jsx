function SystemicHistory({ formData, updateFields }) {
  const { systemicHistory } = formData.medicalHistory;

  return (
    <div className="flex flex-col items-center w-full">
      <h1 className="text-xl font-bold mb-6 ">Systematic History</h1>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="centralNervousSystem">Central Nervous System</label>
        <textarea
          type="text"
          value={systemicHistory.centralNervousSystem}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="cardiovascularSystem">Cardio-vascular System</label>
        <textarea
          type="text"
          value={systemicHistory.cardiovascularSystem}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="gastrointestinalSystem">Gastro-intestinal System</label>
        <textarea
          type="text"
          value={systemicHistory.gastrointestinalSystem}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="genitourinarySystem">Genito-urinary System</label>
        <textarea
          type="text"
          value={systemicHistory.genitourinarySystem}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="musculoskeletalSystem">Musculo-skeletal System</label>
        <textarea
          type="text"
          value={systemicHistory.musculoskeletalSystem}
          className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
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
    </div>
  );
}

export default SystemicHistory;

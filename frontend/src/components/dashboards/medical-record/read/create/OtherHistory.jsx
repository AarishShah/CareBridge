function OtherHistory({ formData, updateFields }) {
  const {
    pastSurgicalHistory,
    pastMedicalHistory,
    familyHistory,
    drugHistory,
    allergies,
    gynecologicalHistory,
    occupationalHistory,
    travelHistory,
    socioeconomicHistory,
  } = formData.medicalHistory;

  return (
    <div className="flex flex-col items-center w-full ">
      <h1 className="text-xl font-bold ">Other History</h1>

      <div  className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="pastSurgicalHistory">Past Surgical History</label>
        <input
          type="text"
          value={pastSurgicalHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                pastSurgicalHistory: event.target.value,
              },
            })
          }
          autoFocus
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="pastMedicalHistory">Past Medical History</label>
        <input
          type="text"
          value={pastMedicalHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                pastMedicalHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4"> 
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="familyHistory">Family History</label>
        <input
          type="text"
          value={familyHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                familyHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="allergies">Allergies</label>
        <input
          type="text"
          value={allergies}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                allergies: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="drugHistory">Drug History</label>
        <input
          type="text"
          value={drugHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                drugHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="gynecologicalHistory">Gynecological History</label>
        <input
          type="text"
          value={gynecologicalHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                gynecologicalHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="occupationalHistory">Occupational History</label>
        <input
          type="text"
          value={occupationalHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                occupationalHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="travelHistory">Travel History</label>
        <input
          type="text"
          value={travelHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                travelHistory: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="w-2/3 mb-4">
        <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="socioeconomicHistory">Socio-economic History</label>
        <input
          type="text"
          value={socioeconomicHistory}
           className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Your name..."
          onChange={(event) =>
            updateFields({
              medicalHistory: {
                ...formData.medicalHistory,
                socioeconomicHistory: event.target.value,
              },
            })
          }
        />
      </div>
    </div>
  );
}

export default OtherHistory;

import React from "react";

function Title({ formData, updateFields }) {
  const { title, biodata } = formData.medicalHistory;

  return (
    <div className="flex flex-col items-center mt-10 mb-6 w-full">
       <h1 className="text-2xl font-bold mb-16 ">Title</h1>

       <div className="w-2/3 mb-4">
       <label
       className="block text-gray-700 text-lg font-bold mb-2"
         htmlFor="title">Title</label>
      <input
        type="text"
        value={title}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
           placeholder="Main Symptom..."
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              title: event.target.value,
            },
          })
        }
        autoFocus
        required
      />
       </div>

       <div className="w-2/3 mb-4">
       <label
       className="block text-gray-700 text-lg font-bold mb-2"
        htmlFor="modeOfAdmission">Mode of Admission</label>
      <select
        name="modeOfAdmission"
        id="modeOfAdmission"
        value={biodata.modeOfAdmission}
         className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        onChange={(event) =>
          updateFields({
            medicalHistory: {
              ...formData.medicalHistory,
              biodata: {
                ...formData.medicalHistory.biodata,
                modeOfAdmission: event.target.value,
              },
            },
          })
        }
      >
        <option value="Emergency">Emergency</option>
        <option value="Outpatient">Outpatient</option>
      </select>

       </div>
     
      
    </div>
  );
}

export default Title;

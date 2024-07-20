import React from "react";

function ProfessionalInfo({
  specialization,
  yearsOfExperience,
  qualifications,
  updateField,
}) {
  return (
    <div  className="flex flex-col items-center mt-10 mb-2 w-full">

    <h1 className="text-xl font-bold mb-12">Professional Information</h1>

      <div className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">Specialization</label>
      <input
        type="text"
        value={specialization}
        onChange={(e) => {
          updateField({ specialization: e.target.value });
        }}
        autoFocus
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Add separator using commas"
        
      />

      </div>

      <div  className="w-2/3 mb-4">

      <label className="block text-gray-700 text-sm font-bold mb-2">Years of Experience</label>
      <input
        type="number"
        value={yearsOfExperience}
        onChange={(e) => updateField({ yearsOfExperience: e.target.value })}
        min={1}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

      />

      </div>
     
      <div className="w-2/3 mb-4" >

      <label className="block text-gray-700 text-sm font-bold mb-2">Qualifications</label>
      <input
        type="text"
        placeholder="Add separator using commas"
        value={qualifications}
        onChange={(e) => updateField({ qualifications: e.target.value })}
        // required
        className=" border-gray-600 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

      />

      </div>
      
    </div>
  );
}

export default ProfessionalInfo;

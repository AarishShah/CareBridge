const OpenAI = require('openai');

// Initialize the OpenAI API with your API key
const openai = new OpenAI(
  {
    apiKey: ''
  });

/**
 * Extracts relevant information from a medical history object to create a summary prompt.
 * @param {Object} medicalHistory The medical history object.
 * @returns {String} A string containing extracted information for summarization.
 */
function extractRelevantInfo(medicalHistory)
{
  const
    {
      title,
      biodata: { name, gender, age, occupation, maritalStatus },
      modeOfAdmission,
      dateOfAdmission,
      historyOfPresentingComplaints,
      historyOfPresentingIllness,
      systemicHistory,
      pastSurgicalHistory,
      pastMedicalHistory,
      familyHistory,
      drugHistory,
      allergies,
      gynecologicalHistory,
      occupationalHistory,
      travelHistory,
      socioeconomicHistory,
      examination,
      investigations,
      treatment,
    } = medicalHistory;


  const summaryPrompt = `
  Summarise this medical record in about 100 words. This summary should be such that when the doctor reads it, it would give an idea about the Medical Record document.:
  Title: ${title}
  Name: ${name}, Age: ${age.years} years, Gender: ${gender}, Occupation: ${occupation}, Marital Status: ${maritalStatus}
  Mode of Admission: ${modeOfAdmission}, Date of Admission: ${dateOfAdmission}
  Presenting Complaints: ${historyOfPresentingComplaints || 'N/A'}
  Presenting Illness History: ${historyOfPresentingIllness || 'N/A'}
  Systemic History: CNS: ${systemicHistory.centralNervousSystem || 'N/A'}, CVS: ${systemicHistory.cardiovascularSystem || 'N/A'}, GIT: ${systemicHistory.gastrointestinalSystem || 'N/A'}
  Past Surgical History: ${pastSurgicalHistory || 'N/A'}
  Past Medical History: ${pastMedicalHistory || 'N/A'}
  Family History: ${familyHistory || 'N/A'}
  Drug History: ${drugHistory || 'N/A'}, Allergies: ${allergies || 'N/A'}
  Gynecological History: ${gynecologicalHistory || 'N/A'}
  Occupational History: ${occupationalHistory || 'N/A'}, Travel History: ${travelHistory || 'N/A'}, Socioeconomic History: ${socioeconomicHistory || 'N/A'}
  Examinations and Investigations: ${investigations || 'N/A'}
  Treatment Plan: Prescribed Drug: ${treatment.prescribedDrug || 'N/A'}, Dosage: ${treatment.dosage || 'N/A'}
    `.trim();

  return summaryPrompt;
}

/**
 * Generates a summary for a given medical history using the OpenAI API.
 * @param {Object} medicalHistory The medical history object.
 * @returns {Promise<String>} A promise that resolves to the summary string.
 */
async function summarize(medicalHistory)
{
  // Extract relevant information for summarization
  const content = extractRelevantInfo(medicalHistory);

  try
  {
    // Generate a summary using the OpenAI API
    const completion = await openai.chat.completions.create(
      {
        messages: [{ role: "system", content: content }],
        model: "gpt-3.5-turbo",
      });

    // Return the summary text
    return completion.choices[0].message.content.trim();

  } catch (error)
  {
    console.error("Error generating summary with OpenAI:", error);
    return null; // In case of an error, return null so the summary field remains unchanged
  }
}

module.exports = { summarize };
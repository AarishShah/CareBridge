const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { GoogleGenerativeAI } = require("@google/generative-ai");

const key = process.env.GEMINI_API_KEY;

// Initialize the Gemini AI API with your API key
const genAI = new GoogleGenerativeAI(key);

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
  Provide the following details based on the given medical record:
  1. Summary: Summarize this medical record in about 100 words. This summary should be such that when the doctor reads it, it would give an idea about the Medical Record document.
  2. Prediction: Predict future diseases that the patient might be at risk for based on the given medical history.
  3. Remedy: Suggest possible remedies or medications for the patient based on the medical history.

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
  Examination: BP: ${examination.generalPhysicalExamination.bloodPressure || 'N/A'}, Pulse: ${examination.generalPhysicalExamination.pulse || 'N/A'}, Temp: ${examination.generalPhysicalExamination.temperature || 'N/A'}, RR: ${examination.generalPhysicalExamination.respiratoryRate || 'N/A'}, Blood Sugar: ${examination.generalPhysicalExamination.bloodSugarLevel || 'N/A'}, Notes: ${examination.generalPhysicalExamination.notes || 'N/A'}
  Investigations: ${investigations || 'N/A'}
  Treatment Plan: Prescribed Drug: ${treatment.prescribedDrug || 'N/A'}, Dosage: ${treatment.dosage || 'N/A'}
  `.trim();

  return summaryPrompt;
}

/**
 * Generates a summary for a given medical history using the Gemini API.
 * @param {Object} medicalHistory The medical history object.
 * @returns {Promise<String>} A promise that resolves to the summary string.
 */
async function summarize(medicalHistory)
{
  // Extract relevant information for summarization
  const content = extractRelevantInfo(medicalHistory);

  try
  {
    // Generate a summary using the Gemini API
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(content);
    const response = await result.response;
    const message = await response.text();

    // Return the summary text
    return message.trim();
  } catch (error)
  {
    // console.error("Error generating summary with Gemini AI:", error);
    return null; // In case of an error, return null so the summary field remains unchanged
  }
}

module.exports = { summarize };

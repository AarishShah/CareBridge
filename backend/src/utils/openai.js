const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const OpenAI = require('openai');

const key = process.env.OPENAI_API_KEY;

const tempResponse = `Summary
The patient, presenting with acute chest pain radiating to the left arm, shortness of breath, sweating, and nausea, was admitted on an emergency basis. History reveals episodic chest pains over the past week, initially attributed to indigestion. The patient has a significant medical history of high cholesterol and a 20-year smoking habit, with a family history of heart disease. Examination shows high blood pressure, tachycardia, and signs of ischemia on the ECG. Initial treatment includes a loading dose of aspirin. Further investigations, including blood tests and imaging, are scheduled to determine the extent of cardiac involvement.

Prediction of Future Diseases
Given the patient's history of high cholesterol, long-term smoking, and familial predisposition to heart disease, there is a high risk of developing coronary artery disease, myocardial infarction, and chronic obstructive pulmonary disease (COPD). Continuous monitoring and proactive management of these risk factors are crucial to prevent potential life-threatening conditions.

Remedy/Medication
1. Aspirin (325mg, oral, once as a loading dose) to reduce the risk of clot formation.
2. Statins to manage high cholesterol levels.
3. Beta-blockers to manage tachycardia and reduce myocardial oxygen demand.
4. Smoking cessation programs and nicotine replacement therapy to help the patient quit smoking.
5. Lifestyle modifications including a heart-healthy diet, regular exercise, and stress management techniques to improve overall cardiovascular health.`

// Initialize the OpenAI API with your API key
const openai = new OpenAI(
  {
    apiKey: key
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
    // console.error("Error generating summary with OpenAI:", error);
    // return null; // In case of an error, return null so the summary field remains unchanged
    return tempResponse; // For testing purposes, remove this line when the OpenAI API is working
  }
}

module.exports = { summarize };
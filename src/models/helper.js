
const Patient = require('./patient');
const Doctor = require('./doctor');

const assignDoctorToPatient = async (patientId, doctorId) =>
{
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient)
    {
        throw new Error('Patient not found');
    }

    if (!doctor)
    {
        throw new Error('Doctor not found');
    }

    // Check if the doctor is already assigned to the patient
    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());
    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());

    if (doctorAssigned)
    {
        throw new Error('Doctor already assigned to the patient');
    }

    else (!doctorAssigned)
    {
        patient.assignedDoctors.push({ doctor: doctorId, name: doctor.name, email: doctor.email });
        await patient.save();
    }

    if (patientAssigned)
    {
        throw new Error('Patient already assigned to the doctor');
    }
    else (!patientAssigned)
    {
        doctor.assignedPatients.push({ patient: patientId, name: patient.name, email: patient.email });
        await doctor.save();
    }
};

const removeDoctorFromPatient = async (patientId, doctorId) =>
{
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient)
    {
        throw new Error('Patient not found');
    }

    if (!doctor)
    {
        throw new Error('Doctor not found')
    }

    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());

    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());

    if (!doctorAssigned)
    {
        throw new Error('Doctor not assigned to the patient');
    }

    else 
    {
        patient.assignedDoctors = patient.assignedDoctors.filter(doc => doc.doctor.toString() !== doctorId.toString());
        await patient.save();
    }

    if (!patientAssigned)
    {
        throw new Error('Patient not assigned to the doctor');
    }

    else
    {
        doctor.assignedPatients = doctor.assignedPatients.filter(pat => pat.patient.toString() !== patientId.toString());
        await doctor.save();
    }
};

module.exports = { assignDoctorToPatient, removeDoctorFromPatient };

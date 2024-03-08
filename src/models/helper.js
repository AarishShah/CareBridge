const Patient = require('./patient');
const Doctor = require('./doctor');

const assignDoctor = async (patientId, doctorId) =>
{
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient)
    {
        return { error: true, message: 'Patient not found' };
    }

    if (!doctor)
    {
        return { error: true, message: 'Doctor not found' };
    }

    // Check if the doctor is already assigned to the patient
    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());
    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());

    if (doctorAssigned)
    {
        return { error: true, message: 'Doctor already assigned to the patient' };
    }

    else (!doctorAssigned)
    {
        patient.assignedDoctors.push({ doctor: doctorId, name: doctor.name, email: doctor.email });
        await patient.save();
    }

    if (patientAssigned)
    {
        return { error: true, message: 'Patient already assigned to the doctor' };
    }
    else (!patientAssigned)
    {
        doctor.assignedPatients.push({ patient: patientId, name: patient.name, email: patient.email });
        await doctor.save();
    }
    
    return { error: false };
};

const removeDoctor = async (patientId, doctorId) =>
{
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient)
    {
        return { error: true, message: 'Patient not found' };
    }

    if (!doctor)
    {
        return { error: true, message: 'Doctor not found' };
    }

    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());

    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());

    if (!doctorAssigned)
    {
        return { error: true, message: 'Doctor not assigned to the patient' };
    }

    else 
    {
        patient.assignedDoctors = patient.assignedDoctors.filter(doc => doc.doctor.toString() !== doctorId.toString());
        await patient.save();
    }

    if (!patientAssigned)
    {
        return { error: true, message: 'Patient not assigned to the doctor' };
    }

    else
    {
        doctor.assignedPatients = doctor.assignedPatients.filter(pat => pat.patient.toString() !== patientId.toString());
        await doctor.save();
    }

    return { error: false };
};

module.exports = { assignDoctor, removeDoctor };

const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const Notification = require('../models/notification');

// Function to allow a patient to send a connection request to a doctor
const assignDoctorRequest = async (patientId, doctorId) => {
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient) {
        return { error: true, message: 'Patient not found' };
    }

    if (!doctor) {
        return { error: true, message: 'Doctor not found' };
    }

    // Check if the doctor is already assigned to the patient
    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());
    if (doctorAssigned) {
        return { error: true, message: 'Doctor already assigned to the patient' };
    }

    // Check if there's already a pending request from the patient to the doctor
    const existingRequest = await Notification.findOne({
        patient: patientId,
        doctor: doctorId,
        status: 'pending'
    });

    // If the patient has created another request to the same doctor, return an error
    if (existingRequest && existingRequest.createdBy === 'patient') {
        return { error: true, message: 'You already have a pending request to this doctor' };
    }

    // Check if there's a pending request from the doctor to the patient
    const reciprocalRequest = await Notification.findOne({
        doctor: doctorId,
        patient: patientId,
        status: 'pending',
        createdBy: 'doctor'
    });

    if (reciprocalRequest) {
        // Automatically connect them
        patient.assignedDoctors.push({ doctor: doctorId, name: doctor.name, email: doctor.email });
        await patient.save();

        doctor.assignedPatients.push({ patient: patientId, name: patient.name, email: patient.email });
        await doctor.save();

        await Notification.deleteOne({ _id: reciprocalRequest._id });

        return { error: false, message: 'Doctor and patient connected automatically' };
    }

    // Create a new request notification
    const notification = new Notification({
        doctor: doctorId,
        patient: patientId,
        message: `Patient ${patient.name} wants to connect with you`,
        createdBy: 'patient'
    });
    await notification.save();

    return { error: false, message: 'Request sent successfully' };
};

// Function to handle the response from a doctor (accept or reject)
const handleDoctorResponse = async (notificationId, action) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        return { error: true, message: 'Notification not found' };
    }

    if (action === 'accept') {
        const patient = await Patient.findById(notification.patient);
        const doctor = await Doctor.findById(notification.doctor);

        if (!patient) {
            return { error: true, message: 'Patient not found' };
        }

        if (!doctor) {
            return { error: true, message: 'Doctor not found' };
        }

        // Assign the doctor to the patient
        patient.assignedDoctors.push({ doctor: doctor._id, name: doctor.name, email: doctor.email });
        await patient.save();

        doctor.assignedPatients.push({ patient: patient._id, name: patient.name, email: patient.email });
        await doctor.save();

        await Notification.deleteOne({ _id: notificationId });

        return { error: false, message: 'Doctor assigned successfully' };
    } else if (action === 'reject') {
        await Notification.deleteOne({ _id: notificationId });

        return { error: false, message: 'Request rejected successfully' };
    } else {
        return { error: true, message: 'Invalid action' };
    }
};

// Function to handle the response from a patient (accept or reject)
const handlePatientResponse = async (notificationId, action) => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        return { error: true, message: 'Notification not found' };
    }

    if (action === 'accept') {
        const patient = await Patient.findById(notification.patient);
        const doctor = await Doctor.findById(notification.doctor);

        if (!patient) {
            return { error: true, message: 'Patient not found' };
        }

        if (!doctor) {
            return { error: true, message: 'Doctor not found' };
        }

        // Assign the doctor to the patient
        patient.assignedDoctors.push({ doctor: doctor._id, name: doctor.name, email: doctor.email });
        await patient.save();

        doctor.assignedPatients.push({ patient: patient._id, name: patient.name, email: patient.email });
        await doctor.save();

        await Notification.deleteOne({ _id: notificationId });

        return { error: false, message: 'Patient assigned successfully' };
    } else if (action === 'reject') {
        await Notification.deleteOne({ _id: notificationId });

        return { error: false, message: 'Request rejected successfully' };
    } else {
        return { error: true, message: 'Invalid action' };
    }
};

// Function to remove a doctor or a patient from the assigned list
const removeDoctor = async (patientId, doctorId) => {
    const patient = await Patient.findById(patientId);
    const doctor = await Doctor.findById(doctorId);

    if (!patient) {
        return { error: true, message: 'Patient not found' };
    }

    if (!doctor) {
        return { error: true, message: 'Doctor not found' };
    }

    const doctorAssigned = patient.assignedDoctors.some(doc => doc.doctor.toString() === doctorId.toString());
    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());

    if (!doctorAssigned) {
        return { error: true, message: 'Doctor not assigned to the patient' };
    } else {
        patient.assignedDoctors = patient.assignedDoctors.filter(doc => doc.doctor.toString() !== doctorId.toString());
        await patient.save();
    }

    if (!patientAssigned) {
        return { error: true, message: 'Patient not assigned to the doctor' };
    } else {
        doctor.assignedPatients = doctor.assignedPatients.filter(pat => pat.patient.toString() !== patientId.toString());
        await doctor.save();
    }

    return { error: false };
};

// Function to allow a doctor to send a connection request to a patient
const doctorRequestPatient = async (doctorId, patientId) => {
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor) {
        return { error: true, message: 'Doctor not found' };
    }

    if (!patient) {
        return { error: true, message: 'Patient not found' };
    }

    // Check if the patient is already assigned to the doctor
    const patientAssigned = doctor.assignedPatients.some(pat => pat.patient.toString() === patientId.toString());
    if (patientAssigned) {
        return { error: true, message: 'Patient already assigned to the doctor' };
    }

    // Check if there's already a pending request from the doctor to the patient
    const existingRequest = await Notification.findOne({
        doctor: doctorId,
        patient: patientId,
        status: 'pending'
    });

    // If the doctor has created another request to the same patient, return an error
    if (existingRequest && existingRequest.createdBy === 'doctor') {
        return { error: true, message: 'You already have a pending request to this patient' };
    }

    // Check if there's a pending request from the patient to the doctor
    const reciprocalRequest = await Notification.findOne({
        doctor: doctorId,
        patient: patientId,
        status: 'pending',
        createdBy: 'patient'
    });

    if (reciprocalRequest) {
        // Automatically connect them
        patient.assignedDoctors.push({ doctor: doctorId, name: doctor.name, email: doctor.email });
        await patient.save();

        doctor.assignedPatients.push({ patient: patientId, name: patient.name, email: patient.email });
        await doctor.save();

        await Notification.deleteOne({ _id: reciprocalRequest._id });

        return { error: false, message: 'Doctor and patient connected automatically' };
    }

    // Create a new request notification
    const notification = new Notification({
        doctor: doctorId,
        patient: patientId,
        message: `Doctor ${doctor.name} wants to connect with you`,
        createdBy: 'doctor'
    });
    await notification.save();

    return { error: false, message: 'Request sent successfully' };
};

// Function to cancel an outgoing request
const cancelOutgoingRequest = async (notificationId, userId, role) => {
    const filter = { _id: notificationId, status: 'pending' };

    if (role === 'patient') {
        filter.patient = userId;
        filter.createdBy = 'patient';
    } else if (role === 'doctor') {
        filter.doctor = userId;
        filter.createdBy = 'doctor';
    } else {
        return { error: true, message: 'Invalid role' };
    }

    const notification = await Notification.findOne(filter);

    if (!notification) {
        return { error: true, message: 'Request not found or already processed' };
    }

    await Notification.deleteOne({ _id: notificationId });

    return { error: false, message: 'Request canceled successfully' };
};

module.exports = { assignDoctorRequest, handleDoctorResponse, handlePatientResponse, removeDoctor, doctorRequestPatient, cancelOutgoingRequest };

import React from "react";
import Navbar from "../dashboard/Navbar";
import PatientImages from "../dashboard/home/PatientImages";

function PatientDashboard() {
  return (
    <div>
    <Navbar userType="patient"/>
    <PatientImages />
  </div>
  );
}

export default PatientDashboard;

import image1 from "../../assets/9.png";
import image2 from "../../assets/10.png";
import image3 from "../../assets/11.png";
import image4 from "../../assets/14.png";
import image5 from "../../assets/13.png";

const patientImagesData = [
  { src: image1, heading: "", component: "PersonalInfoPatient" },

  {
    src: image2,
    heading: "Files",
    text: "Easily access and review your old <br/> medical records to stay informed <br/> about your health journey",
    buttons: [
      { text: "View Medical Files", path: "/patient/dashboard/medical-files" },
      { text: "Upload Medical File", path: "/patient/dashboard/medical-files/upload" },
    ],
  },

  {
    src: image3,
    heading: "Prescription",
    text: "Access and manage your<br/> uploaded prescriptions<br/> conveniently to stay informed<br/> about your healthcare needs.",
    button: { text: "View Prescription", path: "/prescription" },
  },

  {
    src: image4,
    heading: "Medical Records",
    text: "View and manage your complete<br/> medical history conveniently to stay<br/> informed about your health journey",
    button: { text: "View Medical History", path: "/patient/all-medical-records" },
  },

  {
    src: image5,
    heading: "Connect to Doctors",
    text: "Easily view and manage doctors<br/> assigned to you for personalized<br/> healthcare support.",
    buttons: [
      { text: "Connect to Doctors", path: "/assign-doctors" },
      {
        text: "View Incoming Requests",
        path: "/patient/view-incoming-requests",
      },
      {
        text: "View Outgoing Requests",
        path: "/patient/view-outgoing-requests",
      },
    ],
  },
  {
    src: image4,
    heading: "Two-Factor Authentication",
    text: "Manage your 2-Factor Authentication <br/> settings for enhanced security.",
    button: { text: "Two-Factor Authentication", path: "/patient/enable2fa" },
  },
];

export default patientImagesData;

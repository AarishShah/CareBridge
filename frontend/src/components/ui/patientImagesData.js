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
      { text: "View Medical Files", path: "medical-files" },
      { text: "Upload Medical File", path: "medical-files/upload" },
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
    button: { text: "View Medical History", path: "/all-medical-records" },
  },

  {
    src: image5,
    heading: "Assigned Doctors",
    text: "Easily view and manage doctors<br/> assigned to you for personalized<br/> healthcare support.",
    buttons: [{ text: "Assign Doctors" }, { text: "View Assigned Doctors" }],
  },
  {
    src: image4,
    heading: "Enable 2 FA",
    text: "View and manage your complete<br/> medical history conveniently to stay<br/> informed about your health journey",
    button: { text: "Enable Two Factor Authentication", path: "/enable2fa" },
  },
];

export default patientImagesData;
